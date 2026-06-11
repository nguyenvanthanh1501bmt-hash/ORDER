'use client'

import { useEffect, useState } from 'react'
import client from '@/api/client'

export default function useOrderRealTime(
  fetchOrders,
  setErrorText,
  channelName = 'staff-orders-realtime'
) {
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTING')

  useEffect(() => {
    let reloadTimer = null

    const scheduleReload = () => {
      clearTimeout(reloadTimer)

      reloadTimer = setTimeout(() => {
        fetchOrders(false)
      }, 500)
    }

    fetchOrders(true)

    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          scheduleReload()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => {
          scheduleReload()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bills' },
        () => {
          scheduleReload()
        }
      )
      .subscribe((status, err) => {
        setRealtimeStatus(status)

        if (err) {
          console.error('Realtime error:', err)
          setErrorText('Realtime connection error.')
        }
      })

    return () => {
      clearTimeout(reloadTimer)
      client.removeChannel(channel)
    }
  }, [fetchOrders, setErrorText, channelName])

  return {
    realtimeStatus,
    isRealtimeConnected: realtimeStatus === 'SUBSCRIBED',
  }
}