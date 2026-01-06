'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookUser, Pizza, Receipt, UtensilsCrossed, LayoutGrid } from 'lucide-react'

export default function SideNav() {
  const menuList = [
    { id: 1, name: 'Dashboard', icon: <LayoutGrid />, path: '/pages/admin/dashboard' },
    { id: 2, name: 'Employee', icon: <BookUser />, path: '/pages/admin/Employee' },
    { id: 3, name: 'Food', icon: <Pizza />, path: '/pages/admin/Food' },
    { id: 4, name: 'Bill', icon: <Receipt />, path: '/pages/admin/Bill' },
    { id: 5, name: 'Table', icon: <UtensilsCrossed />, path: '/pages/admin/Table' },
  ];

  const path = usePathname(); // App Router hook

  const isActive = (menuPath) => path === menuPath || path.startsWith(menuPath + '/');

  return (
    <div className="h-screen p-5 border flex flex-col">
      <div className="flex flex-col mt-5 gap-2">
        {menuList.map((menu) => (
          <Link key={menu.id} href={menu.path}>
            <h2 className={`
              flex gap-2 items-center
              text-gray-500 font-medium p-4
              rounded-full cursor-pointer
              hover:text-primary hover:bg-blue-100
              ${isActive(menu.path) ? 'text-primary bg-blue-100' : ''}
            `}>
              {menu.icon}
              <span>{menu.name}</span>
            </h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
