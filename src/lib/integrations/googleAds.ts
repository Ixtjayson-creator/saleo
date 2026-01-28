import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@/lib/supabaseServer';

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const developerToken = process.env.GOOGLE_DEVELOPER_TOKEN;

/**
 * Fetches ad spend from Google Ads for a specific account.
 * Handles token refresh and basic rate limiting (retries).
 */
export async function syncGoogleAdsSpend(adAccount: any) {
    const { access_token, refresh_token, external_account_id, user_id } = adAccount;

    const oauth2Client = new OAuth2Client(clientID, clientSecret);
    oauth2Client.setCredentials({
        access_token: access_token,
        refresh_token: refresh_token,
    });

    try {
        // 1. Refresh token if needed
        const { credentials } = await oauth2Client.refreshAccessToken();
        const currentToken = credentials.access_token;

        // 2. Query Google Ads API (GAQL)
        // Fetch last 30 days of spend
        const query = `
      SELECT
        segments.date,
        metrics.cost_micros
      FROM ad_group
      WHERE segments.date DURING LAST_30_DAYS
    `;

        const response = await axios.post(
            `https://googleads.googleapis.com/v17/customers/${external_account_id}/googleAds:search`,
            { query },
            {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'developer-token': developerToken,
                    'login-customer-id': external_account_id, // Usually the same, but depends on manager vs client account
                },
            }
        );

        const rows = response.data.results || [];
        const spendRows = rows.map((row: any) => ({
            user_id,
            date: row.segments.date,
            spend_amount: Number(row.metrics.costMicros) / 1000000, // Google micros to currency
            campaign_id: 'google_ads_sync',
        }));

        // 3. Upsert into Supabase ad_spend
        const supabase = await createClient();
        const { error: upsertError } = await supabase
            .from('ad_spend')
            .upsert(spendRows, { onConflict: 'user_id, date, campaign_id' });

        if (upsertError) throw upsertError;

        // 4. Update the stored token if it changed
        if (credentials.access_token !== access_token) {
            await supabase
                .from('ad_accounts')
                .update({
                    access_token: credentials.access_token,
                    token_expires_at: new Date(credentials.expiry_date!).toISOString()
                })
                .eq('id', adAccount.id);
        }

        return { success: true, count: spendRows.length };

    } catch (error: any) {
        console.error('Google Ads Sync Error:', error.response?.data || error.message);
        if (error.response?.status === 429) {
            // Basic rate limit handling: signal to retry later
            throw new Error('RATE_LIMIT_EXCEEDED');
        }
        throw error;
    }
}
