import { supabaseAdmin } from '@/api/adminClient';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { table_id, items } = await req.json();

  try {
    // --- 1. Lấy bill đang mở hoặc tạo mới ---
    let { data: bill, error: findBillErr } = await supabaseAdmin
      .from('bills')
      .select('*')
      .eq('table_id', table_id)
      .eq('status', 'open')
      .single();

    if (findBillErr && findBillErr.code !== 'PGRST116') {
      throw findBillErr;
    }

    if (!bill) {
      const { data: newBill, error: createBillErr } = await supabaseAdmin
        .from('bills')
        .insert([{ table_id, total_amount: 0 }])
        .select('*')
        .single();

      if (createBillErr) throw createBillErr;
      bill = newBill;
    }

    // --- 2. Tạo order mới ---
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert([{ bill_id: bill.id }])
      .select('*')
      .single();

    if (orderErr) throw orderErr;

    // --- 3. Lấy giá menu_items ---
    const menuIds = items.map(i => i.menu_item_id);
    const { data: menuData, error: menuErr } = await supabaseAdmin
      .from('menu_items')
      .select('id, price')
      .in('id', menuIds);

    if (menuErr) throw menuErr;

    // --- 4. Tạo dữ liệu order_items ---
    const orderItemsData = items.map(item => {
      const menu = menuData.find(m => m.id === item.menu_item_id);
      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menu?.price ?? 0,
        base_item_name: item.base_item_name,
        selected_options: item.selected_options || {}
      };
    });

    // --- 5. Insert order_items ---
    const { data: createdItems, error: itemErr } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData)
      .select('*');

    if (itemErr) throw itemErr;

    // --- return ---
    return NextResponse.json({
      table_id,
      bill,
      order,
      order_items: createdItems
    });
  } catch (err) {
    console.error('ORDER API ERROR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
