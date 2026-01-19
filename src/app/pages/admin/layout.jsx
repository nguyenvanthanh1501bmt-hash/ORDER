'use client'

import { useState } from 'react'
import useRoleRedirect from '@/hooks/useRoleRedirect'
import SideNav from '../../components/layout/sidenav'
import AdminHeader from '../../components/layout/adminheader'

export default function DashboardLayout({ children }) {
  const { user, loading, checkingRole } = useRoleRedirect('admin')
  const [openNav, setOpenNav] = useState(false)

  if (loading || checkingRole) return <h1>Loading...</h1>
  if (!user) return null

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <AdminHeader
        onToggleNav={() => setOpenNav(prev => !prev)}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideNav
          open={openNav}
          onClose={() => setOpenNav(false)}
        />

        {/* Main content – PUSH when open nav */}
        <main
          className={`
            flex-1
            p-4 md:p-5
            overflow-auto
            bg-gray-50
            transition-all
            duration-300

            ${openNav ? 'ml-24 lg:ml-0' : 'ml-0'}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
