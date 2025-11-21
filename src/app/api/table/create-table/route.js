import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
    const { tableName, qrCodeId} = await req.json();

    try {
        const {data: tableData, error: tableError} = await supabaseAdmin
            .from('tables')
            .insert({ name: tableName, qr_code_id: qrCodeId })
            .select()
            .single()

        if (tableError) throw tableError;

        return new Response(JSON.stringify(tableData), { status: 200 });
    }
    catch (err) {
        return new Response(JSON.stringify({ message: err.message }), 
        {status: 400,});
    }
}