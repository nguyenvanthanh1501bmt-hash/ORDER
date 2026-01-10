'use client'

import { useEffect, useState } from 'react'
import useRoleRedirect from '@/hooks/useRoleRedirect'

export default function StaffPage() {
  useRoleRedirect('staff')

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
    console.log("StaffPage mounted, loading orders")
  }, [])

  async function loadOrders() {
    setLoading(true)

    try {
      const res = await fetch('/api/orders/get-order', {
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Failed to load orders')
      }

      const data = await res.json()
      setOrders(data || [])
    } catch (err) {
      console.error('LOAD ORDERS ERROR:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Staff Orders</h1>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500">No pending orders</p>
      )}

      {orders.map(order => (
        <div
          key={order.id}
          className="border rounded-lg p-3 bg-white shadow-sm"
        >
          <div className="font-semibold mb-2">
            {order.bills?.tables?.name}
          </div>

          {order.order_items?.map(item => (
            <div
              key={item.id}
              className="text-sm flex justify-between"
            >
              <span>
                {item.base_item_name} × {item.quantity}
              </span>

              {item.note && (
                <span className="italic text-gray-500">
                  ({item.note})
                </span>
              )}
            </div>
          ))}

          <div className="text-xs text-gray-400 mt-2">
            {new Date(order.created_at).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  )
}
