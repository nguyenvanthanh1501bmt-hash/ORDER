import { supabaseAdmin } from '@/api/adminClient'
import { NextResponse } from 'next/server'

export async function POST(req) {
  /**
   * Client gửi lên 1 payload cho mỗi lần gọi món
   *
   * table_id : ID bàn
   * items    : Danh sách món, MỖI MÓN có note riêng
   */
  const { table_id, items } = await req.json()

  try {
    /* ============================================================
       STEP 1: TÌM / TẠO BILL ĐANG MỞ CHO BÀN
       ------------------------------------------------------------
       - 1 bàn tại 1 thời điểm chỉ có 1 bill status = 'open'
       - Bill đại diện cho toàn bộ phiên thanh toán
    ============================================================ */

    let { data: bill } = await supabaseAdmin
      .from('bills')
      .select('*')
      .eq('table_id', table_id)
      .eq('status', 'open')
      .maybeSingle()

    if (!bill) {
      const { data: newBill, error } = await supabaseAdmin
        .from('bills')
        .insert({ table_id })
        .select()
        .single()

      if (error) throw error
      bill = newBill
    }

    /* ============================================================
       STEP 2: TẠO ORDER MỚI (MỖI LẦN GỌI MÓN = 1 ORDER)
       ------------------------------------------------------------
       - KHÔNG reuse order cũ
       - Order chỉ để gom món + tracking trạng thái
       - KHÔNG chứa note
    ============================================================ */

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        bill_id: bill.id
      })
      .select()
      .single()

    if (orderErr) throw orderErr

    /* ============================================================
       STEP 3: LOAD MENU DATA (GIÁ + TÊN TỪ DB)
       ------------------------------------------------------------
       - KHÔNG tin dữ liệu client
       - Giá và tên phải snapshot từ DB
    ============================================================ */

    const menuIds = items.map(i => i.menu_item_id)

    const { data: menus, error: menuErr } = await supabaseAdmin
      .from('menu_items')
      .select('id, name, price')
      .in('id', menuIds)

    if (menuErr) throw menuErr

    /* ============================================================
       STEP 4: INSERT ORDER ITEMS
       ------------------------------------------------------------
       - Mỗi món là 1 order_item
       - NOTE nằm ở order_item
       - Snapshot name + price
    ============================================================ */

    let totalAdded = 0

    for (const item of items) {
      const menu = menus.find(m => m.id === item.menu_item_id)
      if (!menu) continue

      totalAdded += menu.price * item.quantity

      await supabaseAdmin
        .from('order_items')
        .insert({
          order_id: order.id,
          menu_item_id: menu.id,
          base_item_name: menu.name,   // snapshot tên
          unit_price: menu.price,      // snapshot giá
          quantity: item.quantity,
          note: item.note || null,     // ✅ NOTE ĐÚNG CHỖ
          selected_options: item.selected_options || {}
        })
    }

    /* ============================================================
       STEP 5: UPDATE TỔNG TIỀN BILL
       ------------------------------------------------------------
       - Bill là thứ được thanh toán
       - Chỉ cộng phần phát sinh
    ============================================================ */

    await supabaseAdmin
      .from('bills')
      .update({
        total_amount: bill.total_amount + totalAdded
      })
      .eq('id', bill.id)

    /* ============================================================
       RESPONSE
    ============================================================ */

    return NextResponse.json({
      success: true,
      bill_id: bill.id,
      order_id: order.id
    })
  } catch (err) {
    console.error('ORDER API ERROR:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
