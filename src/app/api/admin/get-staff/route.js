import { supabaseAdmin } from "@/api/adminClient";

export async function GET() {
    try{
        const { data: staffList, error } = await supabaseAdmin
            .from('staff')
            .select()

        if(error) throw error

        return new Response(JSON.stringify(staffList), { status: 200 });
    }
    catch (err){
        return new Response(
            JSON.stringify({ message: err.message || "Server error" }),
            { status: 500 })
    }
    
}