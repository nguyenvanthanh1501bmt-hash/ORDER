'use client'

import { LayoutDashboard, LogOut, Menu, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import client from '@/api/client'

export default function AdminHeader({ onToggleNav }) {
  const handleLogout = async () => {
    const { error } = await client.auth.signOut()
    if (!error) window.location.href = '/'
  }

  const goHome = () => {
    window.location.href = '/pages/admin'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onToggleNav}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle sidebar"
            type="button"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={goHome}
            type="button"
            className="flex min-w-0 items-center gap-3 text-left cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm sm:flex">
              <Shield size={21} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl">
                  Welcome, Admin!
                </h1>

                <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 md:inline-flex">
                  Dashboard
                </span>
              </div>

              <p className="hidden text-sm text-slate-500 sm:block">
                Manage menu, tables, users, and restaurant operations
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 md:flex">
            <LayoutDashboard size={16} />
            Admin Panel
          </div>

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
      </div>
    </header>
  )
}