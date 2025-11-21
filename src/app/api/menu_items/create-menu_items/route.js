import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
    const { name, price, category, sub_category, options } = await req.json();

    try{
        const {data: menuItem, error: menuItemError } = await supabaseAdmin
            .from('menu_items')
            .insert({name, price, category, sub_category, options})
            .select()
            .single()
        
        if(menuItemError) throw menuItemError

        return new Response(JSON.stringify({menuItem}), {status: 200})
    }
    catch (err) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 })
    }
}