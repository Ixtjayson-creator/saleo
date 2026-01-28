import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        // Check for authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch ad spend data
        const { data: spendData, error: spendError } = await supabase
            .from('ad_spend')
            .select('date, spend_amount')
            .eq('user_id', user.id);

        if (spendError) throw spendError;

        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
            .from('sales')
            .select('date, sale_amount')
            .eq('user_id', user.id);

        if (salesError) throw salesError;

        // Group and consolidate data by date
        const dailyStats: Record<string, { spend: number; revenue: number }> = {};

        spendData.forEach(item => {
            const date = item.date;
            if (!dailyStats[date]) dailyStats[date] = { spend: 0, revenue: 0 };
            dailyStats[date].spend += Number(item.spend_amount) || 0;
        });

        salesData.forEach(item => {
            const date = item.date;
            if (!dailyStats[date]) dailyStats[date] = { spend: 0, revenue: 0 };
            dailyStats[date].revenue += Number(item.sale_amount) || 0;
        });

        // Convert to sorted array and calculate profit/roi
        const resultData = Object.entries(dailyStats)
            .map(([date, stats]) => {
                const profit = stats.revenue - stats.spend;
                const roi = stats.spend > 0 ? (profit / stats.spend) * 100 : 0;
                return {
                    date,
                    spend: stats.spend,
                    revenue: stats.revenue,
                    profit,
                    roi: Math.round(roi)
                };
            })
            .sort((a, b) => a.date.localeCompare(b.date));

        // Calculate totals
        const totals = resultData.reduce((acc, curr) => ({
            revenue: acc.revenue + curr.revenue,
            spend: acc.spend + curr.spend,
            profit: acc.profit + curr.profit,
        }), { revenue: 0, spend: 0, profit: 0 });

        const avgRoi = totals.spend > 0 ? (totals.profit / totals.spend) * 100 : 0;

        return NextResponse.json({
            success: true,
            data: resultData,
            totals: {
                ...totals,
                avgRoi: Math.round(avgRoi)
            }
        });

    } catch (error: any) {
        console.error('ROI Calculation Error:', error);
        // Return empty but successful state if tables don't exist yet but user is auth'd
        if (error.code === '42P01') {
            return NextResponse.json({
                success: true,
                data: [],
                totals: { revenue: 0, spend: 0, profit: 0, avgRoi: 0 },
                message: "Tables 'ad_spend' or 'sales' not found in Supabase. Please create them."
            });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
