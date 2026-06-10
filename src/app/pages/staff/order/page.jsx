'use client'

import { useCallback, useEffect, useState } from 'react'
import { getOrdersAvailable } from '@/app/features/order/OrderAvailable'
import OrderAvailableUI from '@/app/features/order/OrderAvailableUI'
import { authFetch } from '@/utils/authFetch'
import client from '@/api/client'

export default function TableCheck() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState(new Set())

  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)

      const data = await getOrdersAvailable()
      console.log('FETCH ORDERS:', data)

      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let reloadTimer = null

    const scheduleReload = () => {
      clearTimeout(reloadTimer)

      reloadTimer = setTimeout(() => {
        console.log('REFETCH ORDERS AFTER REALTIME')
        fetchOrders(false)
      }, 500)
    }

    fetchOrders(true)

    const channel = client
      .channel('staff-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('REALTIME ORDERS:', payload)
          scheduleReload()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        (payload) => {
          console.log('REALTIME ORDER_ITEMS:', payload)
          scheduleReload()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bills' },
        (payload) => {
          console.log('REALTIME BILLS:', payload)
          scheduleReload()
        }
      )
      .subscribe((status, err) => {
        console.log('REALTIME STATUS:', status)

        if (err) {
          console.error('REALTIME ERROR:', err)
        }
      })

    return () => {
      clearTimeout(reloadTimer)
      client.removeChannel(channel)
    }
  }, [fetchOrders])

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => {
      const next = new Set(prev)
      next.has(orderId) ? next.delete(orderId) : next.add(orderId)
      return next
    })
  }

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

      await fetchOrders(false)

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

      await fetchOrders(false)

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

      await fetchOrders(false)

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