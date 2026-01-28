import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import Papa from 'papaparse';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Check for authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const csvText = await file.text();

        // Parse CSV
        const { data, errors } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase().replace(/ /g, '_'),
        });

        if (errors.length > 0) {
            return NextResponse.json({ error: 'Failed to parse CSV', details: errors }, { status: 400 });
        }

        // Add user_id to each row to respect RLS and association
        const rowsWithUser = data.map((row: any) => ({
            ...row,
            user_id: user.id,
            // Ensure numeric fields are actually numbers if they come in as strings
            spend_amount: parseFloat(row.spend_amount || row.amount || row.spend || 0),
            date: row.date || new Date().toISOString().split('T')[0],
        }));

        // Insert into Supabase
        const { error: insertError } = await supabase
            .from('ad_spend')
            .insert(rowsWithUser);

        if (insertError) {
            console.error('Insert error:', insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully uploaded ${rowsWithUser.length} rows to ad_spend.`
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
