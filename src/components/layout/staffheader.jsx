'use client'

import { Button } from "@/components/ui/button"
import client from "@/api/client"
import {
  UtensilsCrossed,
  ClipboardList,
  LogOut,
  Coffee,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export default function StaffHeader() {
  const pathname = usePathname()

  const handleLogout = async () => {
    const { error } = await client.auth.signOut()
    if (!error) window.location.href = '/'
  }

  const isActive = (menuPath) =>
    pathname === menuPath || pathname.startsWith(menuPath + '/')

  const menuList = [
    {
      id: 1,
      name: "Orders",
      icon: ClipboardList,
      path: "/pages/staff/order",
    },
    {
      id: 2,
      name: "Tables",
      icon: UtensilsCrossed,
      path: "/pages/staff/Tablecheck",
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/pages/staff/order"
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Coffee size={21} />
          </div>

          <Link
            href="/pages/staff"
            className="hidden min-w-0 sm:block">
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-bold leading-5 text-slate-900">
                  Restaurant POS
                </p>
                <p className="truncate text-xs text-slate-500">
                  Staff workspace
                </p>
              </div>
          </Link>
          
        </Link>

        <nav className="flex flex-1 justify-center">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1">
            {menuList.map((menu) => {
              const Icon = menu.icon
              const active = isActive(menu.path)

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
                  <Icon
                    size={18}
                    className={clsx(
                      "transition-colors",
                      active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                    )}
                  />

                  <span className="hidden sm:inline">
                    {menu.name}
                  </span>

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