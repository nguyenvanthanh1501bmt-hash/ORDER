'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookUser,
  Pizza,
  Receipt,
  UtensilsCrossed,
  LayoutGrid,
  X,
} from 'lucide-react'
import clsx from 'clsx'

export default function SideNav({ open, isMobile, onClose }) {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      onClose?.()
      previousPathname.current = pathname
    }
  }, [pathname, onClose])

  const menuList = [
    {
      id: 1,
      name: 'Dashboard',
      icon: LayoutGrid,
      path: '/pages/admin/dashboard',
    },
    {
      id: 2,
      name: 'Employee',
      icon: BookUser,
      path: '/pages/admin/Employee',
    },
    {
      id: 3,
      name: 'Food',
      icon: Pizza,
      path: '/pages/admin/Food',
    },
    {
      id: 4,
      name: 'Bill',
      icon: Receipt,
      path: '/pages/admin/Bill',
    },
    {
      id: 5,
      name: 'Table',
      icon: UtensilsCrossed,
      path: '/pages/admin/Table',
    },
  ]

  const isActive = (menuPath) =>
    pathname === menuPath || pathname.startsWith(menuPath + '/')

  const handleNavigate = () => {
    onClose?.()
  }

  return (
    <>
      {isMobile && open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 h-full border-r border-slate-200 bg-white/95 shadow-xl shadow-slate-950/5 backdrop-blur-xl transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none',
          'w-72 lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 lg:hidden">
            <p className="text-sm font-bold text-slate-900">
              Menu
            </p>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Menu
            </div>

            <div className="space-y-1.5">
              {menuList.map((menu) => {
                const Icon = menu.icon
                const active = isActive(menu.path)

                return (
                  <Link
                    key={menu.id}
                    href={menu.path}
                    onClick={handleNavigate}
                    title={menu.name}
                    className={clsx(
                      'group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all',
                      active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <span
                      className={clsx(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                        active
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-700'
                      )}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="truncate">
                      {menu.name}
                    </span>

                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-emerald-300" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-900">
                System online
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Manage your restaurant data from this dashboard.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}