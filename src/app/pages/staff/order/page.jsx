'use client'

import { useEffect, useState } from 'react'
import useRoleRedirect from '@/hooks/useRoleRedirect'
import { getOrdersAvailable } from '@/app/features/order/OrderAvailable'
import OrderAvailableUI from '@/app/features/order/OrderAvailableUI'

export default function TableCheck(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
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

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => {
      const next = new Set(prev)
      next.has(orderId) ? next.delete(orderId) : next.add(orderId)
      return next
    })
  }

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

      // CHỈ update status ở FE
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'accepted' }
            : order
        )
      )

      // đóng dropdown nếu đang mở
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

      // remove order khỏi UI
      setOrders(prev =>
        prev.filter(order => order.id !== orderId)
      )

      // đóng dropdown nếu đang mở
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

      // remove khỏi list sau khi complete
      setOrders(prev =>
        prev.filter(order => order.id !== orderId)
      )

      // đóng dropdown nếu đang mở
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