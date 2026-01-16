'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookUser,
  Pizza,
  Receipt,
  UtensilsCrossed,
  LayoutGrid,
} from 'lucide-react'

export default function SideNav({ open, isMobile, onClose }) {
  const pathname = usePathname()

  const menuList = [
    { id: 1, name: 'Dashboard', icon: <LayoutGrid />, path: '/pages/admin/dashboard' },
    { id: 2, name: 'Employee', icon: <BookUser />, path: '/pages/admin/Employee' },
    { id: 3, name: 'Food', icon: <Pizza />, path: '/pages/admin/Food' },
    { id: 4, name: 'Bill', icon: <Receipt />, path: '/pages/admin/Bill' },
    { id: 5, name: 'Table', icon: <UtensilsCrossed />, path: '/pages/admin/Table' },
  ]

  const isActive = (menuPath) =>
    pathname === menuPath || pathname.startsWith(menuPath + '/')

  const handleNavigate = () => {
    if (isMobile) onClose()
  }

  return (
    <aside
      className={`
        bg-white
        border-r
        h-full
        z-50
        transition-all
        duration-300

        fixed lg:relative
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}

        w-24 lg:w-48
      `}
    >
      <div className="flex flex-col gap-2 p-3">
        {menuList.map(menu => (
          <Link key={menu.id} href={menu.path}>
            <div
              onClick={handleNavigate}
              title={menu.name}
              className={`
                flex items-center
                justify-center lg:justify-start
                gap-3
                p-3
                rounded-xl
                cursor-pointer
                font-medium
                text-gray-500
                hover:text-primary hover:bg-blue-100
                ${isActive(menu.path) ? 'text-primary bg-blue-100' : ''}
              `}
            >
              {menu.icon}
              <span className="hidden lg:inline">
                {menu.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}
