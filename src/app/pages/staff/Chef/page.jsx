'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getOrdersAvailable } from '@/app/features/order/OrderAvailable'
import OrderAvailableUI from '@/app/features/order/OrderAvailableUI'
import { authFetch } from '@/utils/authFetch'
import client from '@/api/client'

export default function ChefPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState(new Set())
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTING')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [errorText, setErrorText] = useState('')

  const orderStats = useMemo(() => {
    const pending = orders.filter(
      order => order.status === 'pending_staff_approval'
    ).length

    const accepted = orders.filter(
      order => order.status === 'accepted'
    ).length

    return {
      total: orders.length,
      pending,
      accepted,
    }
  }, [orders])

  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      setErrorText('')

      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const data = await getOrdersAvailable()

      setOrders(data.filter(order => ['accepted'].includes(order.status)))
      //setOrders(data || [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching orders:', err)
      setErrorText('Cannot load orders. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

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
      .channel('staff-orders-realtime')
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
          status: 'ready_to_serve',
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
      setErrorText(err.message || 'Approve failed')
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
      setErrorText(err.message || 'Reject failed')
    }
  }

  const handleReadyToServe = async (orderId) => {
    try {
        const res = await authFetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            status: 'ready_to_serve',
        }),
        })

        const data = await res.json().catch(() => ({
        message: 'Invalid server response',
        }))

        if (!res.ok) {
        throw new Error(data.message || 'Ready to serve failed')
        }

        // Chef done xong thì remove khỏi Chef page
        setOrders(prev => prev.filter(order => String(order.id) !== String(orderId)))

        setExpandedOrders(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
        })
    } catch (err) {
        console.error(err)
        setErrorText(err.message || 'Ready to serve failed')
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
      setErrorText(err.message || 'Complete failed')
    }
  }

  const isRealtimeConnected = realtimeStatus === 'SUBSCRIBED'

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-8 w-56 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-lg bg-slate-100" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {[1, 2, 3].map(item => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                    Staff Dashboard
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                      isRealtimeConnected
                        ? 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/30'
                        : 'bg-amber-400/15 text-amber-100 ring-amber-300/30'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isRealtimeConnected
                          ? 'bg-emerald-300'
                          : 'bg-amber-300'
                      }`}
                    />
                    {isRealtimeConnected ? 'Realtime connected' : realtimeStatus}
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Waiting for chef to prepare orders
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                    New orders that are accepted will appear here. You can track the status of each order and mark them as done when they are ready to serve.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                {lastUpdated && (
                  <p className="text-xs text-slate-300">
                    Last updated:{' '}
                    <span className="font-medium text-white">
                      {lastUpdated.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => fetchOrders(false)}
                  disabled={refreshing}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Total active
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {orderStats.total}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-medium text-amber-700">
                Waiting approval
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-900">
                {orderStats.pending}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-medium text-emerald-700">
                Accepted
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-900">
                {orderStats.accepted}
              </p>
            </div>
          </div>
        </section>

        {errorText && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorText}
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Order Queue
              </h2>
              <p className="text-sm text-slate-500">
                New orders will appear here automatically.
              </p>
            </div>

            {refreshing && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
                Updating
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
                🍽️
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No active orders
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                When customers place new orders, they will appear here instantly.
              </p>

              <button
                type="button"
                onClick={() => fetchOrders(false)}
                className="mt-5 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Check again
              </button>
            </div>
          ) : (
            <OrderAvailableUI
              orders={orders}
              expandedOrders={expandedOrders}
              toggleOrder={toggleOrder}
              onApprove={handleApprove}
              onReject={handleReject}
              onReadyToServe={handleReadyToServe}
              onDone={handleDone}
            />
          )}
        </section>
      </div>
    </main>
  )
}