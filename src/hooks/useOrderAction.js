'use client'

import { useState } from 'react'
import { authFetch } from '@/utils/authFetch'

export default function useOrderAction(
  fetchOrders,
  setOrders,
  setExpandedOrders,
  setErrorText
) {
  const [loading, setLoading] = useState(null)

  const closeExpandedOrder = (orderId) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev)
      next.delete(orderId)
      return next
    })
  }

  const actionOrder = async ({
    orderId,
    method,
    status,
    errorMessage,
  }) => {
    try {
      setLoading(orderId)
      setErrorText('')

      const options = {
        method,
      }

      if (status) {
        options.body = JSON.stringify({ status })
      }

      const res = await authFetch(`/api/orders?id=${orderId}`, options)

      const data = await res.json().catch(() => ({
        message: 'Invalid server response',
      }))

      if (!res.ok) {
        throw new Error(data.message || errorMessage)
      }

      closeExpandedOrder(orderId)

      return true
    } catch (error) {
      console.error(error)
      setErrorText(error.message || errorMessage)
      return false
    } finally {
      setLoading(null)
    }
  }

  const handleApprove = async (orderId) => {
    const success = await actionOrder({
      orderId,
      method: 'PATCH',
      status: 'accepted',
      errorMessage: 'Approve failed',
    })

    if (success) {
      await fetchOrders(false)
    }
  }

  const handleReject = async (orderId) => {
    const success = await actionOrder({
      orderId,
      method: 'DELETE',
      errorMessage: 'Reject failed',
    })

    if (success) {
      await fetchOrders(false)
    }
  }

  const handleReadyToServe = async (orderId) => {
    const success = await actionOrder({
      orderId,
      method: 'PATCH',
      status: 'ready_to_serve',
      errorMessage: 'Update to ready to serve failed',
    })

    if (success) {
      setOrders((prev) =>
        prev.filter((order) => String(order.id) !== String(orderId))
      )
    }
  }

  const handleDone = async (orderId) => {
    const success = await actionOrder({
      orderId,
      method: 'PATCH',
      status: 'served',
      errorMessage: 'Update to done failed',
    })

    if (success) {
      await fetchOrders(false)
    }
  }

  return {
    handleApprove,
    handleReject,
    handleReadyToServe,
    handleDone,
    loading,
  }
}