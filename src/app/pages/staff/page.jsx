'use client'

import { useEffect, useState } from 'react'
import useRoleRedirect from '@/hooks/useRoleRedirect'
import { getOrdersAvailable } from '@/app/features/Staff/OrderAvailable'
import SupportShowOrderItems from '@/app/features/Staff/SupportOrderItems'

export default function StaffPage() {
  useRoleRedirect('staff')

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * expandedOrders:
   * - Dùng Set để lưu các order.id đang mở
   * - Mỗi order mở / đóng độc lập
   */
  const [expandedOrders, setExpandedOrders] = useState(new Set())

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrdersAvailable()
        setOrders(data)
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <p>Loading...</p>

  /**
   * Toggle mở / đóng một order
   */
  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => {
      const next = new Set(prev)

      if (next.has(orderId)) {
        next.delete(orderId)
      } else {
        next.add(orderId)
      }

      return next
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-bold">
        Orders Pending Staff Approval
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No pending orders for staff approval.
        </p>
      ) : (
        orders.map(order => {
          const isOpen = expandedOrders.has(order.id)

          return (
            <div
              key={order.id}
              className={`
                mb-4 rounded-lg border bg-white
                transition-shadow
                ${isOpen ? 'shadow-md border-gray-300' : 'border-gray-200 hover:shadow-sm'}
              `}
            >
              {/* HEADER */}
              <div
                className="
                  flex items-center justify-between
                  cursor-pointer select-none
                  px-4 py-3
                "
                onClick={() => toggleOrder(order.id)}
              >
                <div className="space-y-0.5">
                  <p className="text-sm text-gray-500">
                    Table
                    <span className="ml-1 font-medium text-gray-800">
                      {order.bills?.tables?.name}
                    </span>
                  </p>

                  <p className="text-xs text-gray-400">
                    Order ID: {order.id}
                  </p>
                </div>

                {/* Chevron */}
                <span
                  className={`
                    text-gray-400 transition-transform duration-300
                    ${isOpen ? 'rotate-180' : ''}
                  `}
                >
                  ▼
                </span>
              </div>

              {/* DROPDOWN */}
              <div
                className={`
                  overflow-hidden
                  transition-[max-height,opacity,transform]
                  duration-300
                  ease-out
                  ${
                    isOpen
                      ? 'max-h-[600px] opacity-100 translate-y-0'
                      : 'max-h-0 opacity-0 -translate-y-2'
                  }
                `}
              >
                <div className="border-t bg-gray-50 px-4 pb-4">
                  <SupportShowOrderItems order={order} />
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
