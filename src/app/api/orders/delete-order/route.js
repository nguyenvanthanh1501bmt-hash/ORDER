import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
    const { orderId } = await req.json()

    if(!orderId) return new Response(JSON.stringify({message: "Không tìm thấy order cần xóa"}), {status: 400})

    try{
        const {data, error} = await supabaseAdmin
            .from('orders')
            .delete()
            .eq('id', orderId)
            .single()
        
            if(error) throw error
        
        return new Response(JSON.stringify({data}), {status: 200})
    }
    catch (err) {
        return new Response(JSON.stringify({message: err.message || "server error"}), {status: 500})
    }
}