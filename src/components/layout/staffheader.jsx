'use client'

import { Button } from "@/components/ui/button"
import client from "@/api/client"
import { UtensilsCrossed, ClipboardList } from "lucide-react"
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
    <header className="sticky top-0 z-50 h-16 px-6 flex items-center justify-between border-b bg-white">
      {/* Navigation */}
      <nav className="flex items-center gap-2">
        {menuList.map((menu) => {
          const Icon = menu.icon
          const active = isActive(menu.path)

          return (
            <Link
              key={menu.id}
              href={menu.path}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                active
                  ? "bg-blue-100 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                size={18}
                className={clsx(
                  "transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              {menu.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        variant="destructive"
        size="sm"
        className="h-9"
      >
        Logout
      </Button>
    </header>
  )
}
