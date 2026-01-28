import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { syncGoogleAdsSpend } from '@/lib/integrations/googleAds';
import { syncMetaAdsSpend } from '@/lib/integrations/metaAds';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get active ad accounts
        const { data: accounts, error: accountError } = await supabase
            .from('ad_accounts')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (accountError) throw accountError;

        if (!accounts || accounts.length === 0) {
            return NextResponse.json({
                message: 'No active ad accounts found. Please connect an account first.'
            }, { status: 200 });
        }

        // 3. Sync each account
        const results = [];
        for (const account of accounts) {
            try {
                let result;
                if (account.platform === 'google') {
                    result = await syncGoogleAdsSpend(account);
                } else if (account.platform === 'meta') {
                    result = await syncMetaAdsSpend(account);
                }
                results.push({ platform: account.platform, id: account.external_account_id, status: 'success', data: result });
            } catch (err: any) {
                results.push({ platform: account.platform, id: account.external_account_id, status: 'error', error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            summary: results,
            synced_at: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Integrations Sync API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
