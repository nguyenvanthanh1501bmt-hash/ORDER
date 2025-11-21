'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Lấy tất cả orders
    supabase
      .from('orders')
      .select('*, order_items(*, menu_items(*))')
      .then(({ data }) => setOrders(data || []));

    // Subscribe realtime INSERT
    const sub = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        payload => {
          setOrders(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(sub);
  }, []);

  const handleAccept = async (orderId) => {
    await fetch('/api/orders/update-status-order', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: 'accepted' })
    });

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'accepted' } : o))
    );
  }

  return (
    <div>
      <h2>Orders</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
          <p>Order #{order.id} - Status: {order.status}</p>
          <ul>
            {order.order_items?.map(item => (
              <li key={item.id}>{item.base_item_name} x {item.quantity}</li>
            ))}
          </ul>
          {order.status === 'pending_staff_approval' && (
            <button onClick={() => handleAccept(order.id)}>Accept</button>
          )}
        </div>
      ))}
    </div>
  );
}
