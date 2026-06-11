'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import client from "@/api/client"
import {
  UtensilsCrossed,
  ClipboardList,
  LogOut,
  Coffee,
  Bell,
  X,
  Armchair
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { getOrdersAvailable } from "@/app/features/order/OrderAvailable"

export default function StaffHeader() {
  const pathname = usePathname()

  const [pendingCount, setPendingCount] = useState(0)
  const [notification, setNotification] = useState(null)
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTING')

  const notificationTimerRef = useRef(null)

  const handleLogout = async () => {
    const { error } = await client.auth.signOut()
    if (!error) window.location.href = '/'
  }

  const isActive = (menuPath) =>
    pathname === menuPath || pathname.startsWith(menuPath + '/')

  const fetchPendingCount = useCallback(async () => {
    try {
      const orders = await getOrdersAvailable()

      const count = (orders || []).filter(
        order => order.status === 'pending_staff_approval'
      ).length

      setPendingCount(count)
    } catch (error) {
      console.error('Failed to fetch pending order count:', error)
    }
  }, [])

  const showNewOrderNotification = useCallback((payload) => {
    const orderId = payload?.new?.id
    const status = payload?.new?.status

    if (status && status !== 'pending_staff_approval') {
      return
    }

    setNotification({
      title: 'New order received',
      message: orderId
        ? `Order #${orderId} is waiting for approval.`
        : 'A customer has placed a new order.',
    })

    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current)
    }

    notificationTimerRef.current = setTimeout(() => {
      setNotification(null)
    }, 5000)
  }, [])

  useEffect(() => {
    let reloadTimer = null

    const scheduleReload = () => {
      clearTimeout(reloadTimer)

      reloadTimer = setTimeout(() => {
        fetchPendingCount()
      }, 400)
    }

    fetchPendingCount()

    const channel = client
      .channel('staff-header-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            showNewOrderNotification(payload)
          }

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
          console.error('Header realtime error:', err)
        }
      })

    return () => {
      clearTimeout(reloadTimer)

      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current)
      }

      client.removeChannel(channel)
    }
  }, [fetchPendingCount, showNewOrderNotification])

  const isRealtimeConnected = realtimeStatus === 'SUBSCRIBED'

  const menuList = [
    {
      id: 1,
      name: "Orders",
      icon: ClipboardList,
      path: "/pages/staff/order",
      badge: pendingCount,
    },
    {
      id: 2,
      name: "Chef-cooking",
      icon: UtensilsCrossed,
      path: "/pages/staff/Chef",
      badge: 0,
    },
    {
      id: 3,
      name: "Tables",
      icon: Armchair,
      path: "/pages/staff/Tablecheck",
      badge: 0,
    }
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      {notification && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border border-emerald-200 bg-white p-4 shadow-2xl shadow-slate-950/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <Bell size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-slate-950">
                {notification.title}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {notification.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/pages/staff"
          className="flex min-w-0 items-center gap-3"
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Coffee size={21} />

            <span
              className={clsx(
                "absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-white",
                isRealtimeConnected ? "bg-emerald-500" : "bg-amber-400"
              )}
              title={isRealtimeConnected ? "Realtime connected" : realtimeStatus}
            />
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold leading-5 text-slate-900">
              Restaurant POS
            </p>

            <p className="truncate text-xs text-slate-500">
              Staff workspace
            </p>
          </div>
        </Link>

        <nav className="flex flex-1 justify-center">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1">
            {menuList.map((menu) => {
              const Icon = menu.icon
              const active = isActive(menu.path)
              const hasBadge = Number(menu.badge || 0) > 0

              return (
                <Link
                  key={menu.id}
                  href={menu.path}
                  className={clsx(
                    "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all sm:px-4",
                    active
                      ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                  )}
                >
                  <div className="relative">
                    <Icon
                      size={18}
                      className={clsx(
                        "transition-colors",
                        active
                          ? "text-slate-900"
                          : "text-slate-400 group-hover:text-slate-700"
                      )}
                    />

                    {hasBadge && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold leading-none text-white ring-2 ring-white">
                        {menu.badge > 9 ? '9+' : menu.badge}
                      </span>
                    )}
                  </div>

                  <span className="hidden sm:inline">
                    {menu.name}
                  </span>

                  {hasBadge && (
                    <span className="sm:hidden ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                      {menu.badge > 9 ? '9+' : menu.badge}
                    </span>
                  )}

                  {active && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-slate-900" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="h-10 rounded-2xl border-red-200 bg-red-50 px-3 font-semibold text-red-600 shadow-none transition hover:bg-red-100 hover:text-red-700 sm:px-4"
        >
          <LogOut size={16} className="sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}