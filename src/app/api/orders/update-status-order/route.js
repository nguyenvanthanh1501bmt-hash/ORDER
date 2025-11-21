import { supabaseAdmin } from '@/api/adminClient';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  const { orderId, status } = await req.json();

  try {
    const { data: updatedOrder } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select('*')
      .single();

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
