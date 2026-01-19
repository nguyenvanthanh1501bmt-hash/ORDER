'use client'

import { useEffect, useState } from 'react'
import useRoleRedirect from '@/hooks/useRoleRedirect'
import { getOrdersAvailable } from '@/app/features/order/OrderAvailable'
import OrderAvailableUI from '@/app/features/order/OrderAvailableUI'

export default function TableCheck(){
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


  // ================= EXPAND OR COLAP ORDERS =============================
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
      const res = await fetch('/api/orders/update-status-order', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: 'accepted',
        }),
      })

      if (!res.ok) {
        throw new Error('Approve failed')
      }

      // update status from pending staff approval -> accepted
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'accepted' }
            : order
        )
      )

      // close dropdown
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
      const res = await fetch('/api/orders/delete-order', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      if (!res.ok) {
        throw new Error('Reject failed')
      }

      // remove order 
      setOrders(prev =>
        prev.filter(order => order.id !== orderId)
      )

      // close dropdown
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
      const res = await fetch('/api/orders/update-status-order', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: 'served',
        }),
      })

      if (!res.ok) {
        throw new Error('Complete failed')
      }

      // unrendered after done 
      setOrders(prev =>
        prev.filter(order => order.id !== orderId)
      )

      // close dropdown
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
    // RENDER UI
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