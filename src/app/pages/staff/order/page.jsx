'use client'

import { useEffect, useState } from 'react'
import { getOrdersAvailable } from '@/app/features/order/OrderAvailable'
import OrderAvailableUI from '@/app/features/order/OrderAvailableUI'
import { authFetch } from '@/utils/authFetch'

export default function TableCheck() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState(new Set())

  // ====================== FETCH ORDERS WITH STATUS = PENDING APPROVAL && ACCEPTED ====================
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

  // ================= EXPAND OR COLLAPSE ORDERS =============================
  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => {
      const next = new Set(prev)
      next.has(orderId) ? next.delete(orderId) : next.add(orderId)
      return next
    })
  }

  // ==================== HANDLERS ==========================
  const handleApprove = async (orderId) => {
    try {
      const res = await authFetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'accepted',
        }),
      })

      const data = await res.json().catch(() => ({
        message: 'Invalid server response',
      }))

      if (!res.ok) {
        throw new Error(data.message || 'Approve failed')
      }

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'accepted' }
            : order
        )
      )

      setExpandedOrders(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (orderId) => {
    try {
      const res = await authFetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE',
      })

      const data = await res.json().catch(() => ({
        message: 'Invalid server response',
      }))

      if (!res.ok) {
        throw new Error(data.message || 'Reject failed')
      }

      setOrders(prev =>
        prev.filter(order => order.id !== orderId)
      )

      setExpandedOrders(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDone = async (orderId) => {
    try {
      const res = await authFetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'served',
        }),
      })

      const data = await res.json().catch(() => ({
        message: 'Invalid server response',
      }))

      if (!res.ok) {
        throw new Error(data.message || 'Complete failed')
      }

      setOrders(prev =>
        prev.filter(order => order.id !== orderId)
      )

      setExpandedOrders(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <OrderAvailableUI
      orders={orders}
      expandedOrders={expandedOrders}
      toggleOrder={toggleOrder}
      onApprove={handleApprove}
      onReject={handleReject}
      onDone={handleDone}
    />
  )
}