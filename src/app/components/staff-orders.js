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

  const handleReject = async (orderId) => {
    // Gửi request xóa order ở server
    await fetch('/api/orders/delete-order', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });

    // Xóa order khỏi UI
    setOrders(prev => prev.filter(o => o.id !== orderId));
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
            <>
              <button onClick={() => handleAccept(order.id)}>Accept</button>{' '}
              <button onClick={() => handleReject(order.id)}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
