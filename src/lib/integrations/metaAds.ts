import axios from 'axios';
import { createClient } from '@/lib/supabaseServer';

/**
 * Fetches ad spend from Meta Ads (Facebook/Instagram).
 * Uses the Graph API /insights endpoint.
 */
export async function syncMetaAdsSpend(adAccount: any) {
    const { access_token, external_account_id, user_id } = adAccount;

    try {
        // 1. Fetch insights from Meta Graph API
        // act_ACCOUNT_ID/insights
        const response = await axios.get(
            `https://graph.facebook.com/v19.0/act_${external_account_id}/insights`,
            {
                params: {
                    access_token: access_token,
                    date_preset: 'last_30d',
                    time_increment: 1, // Daily breakdown
                    fields: 'spend,date_start,account_id',
                },
            }
        );

        const data = response.data.data || [];
        const spendRows = data.map((item: any) => ({
            user_id,
            date: item.date_start,
            spend_amount: parseFloat(item.spend),
            campaign_id: 'meta_ads_sync',
        }));

        // 2. Upsert into Supabase ad_spend
        const supabase = await createClient();
        const { error: upsertError } = await supabase
            .from('ad_spend')
            .upsert(spendRows, { onConflict: 'user_id, date, campaign_id' });

        if (upsertError) throw upsertError;

        return { success: true, count: spendRows.length };

    } catch (error: any) {
        console.error('Meta Ads Sync Error:', error.response?.data || error.message);

        // Check for expired token
        if (error.response?.data?.error?.code === 190) {
            // Mark account as inactive/deauthorized
            const supabase = await createClient();
            await supabase
                .from('ad_accounts')
                .update({ is_active: false })
                .eq('id', adAccount.id);
            throw new Error('AUTH_TOKEN_EXPIRED');
        }

        if (error.response?.status === 400 && error.response.data?.error?.type === 'OAuthException') {
            // Handle rate limits or other OAuth issues
            if (error.response.data?.error?.code === 17) throw new Error('RATE_LIMIT_EXCEEDED');
        }

        throw error;
    }
}
