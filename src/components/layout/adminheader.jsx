'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import client from '@/api/client'

export default function AdminHeader({ onToggleNav }) {
  const handleLogout = async () => {
    const { error } = await client.auth.signOut()
    if (!error) window.location.href = '/'
  }

  return (
    <header className="p-4 flex items-center justify-between border bg-white">
      <div className="flex items-center gap-3">
        {/* Toggle sidenav – mobile + tablet */}
        <button
          onClick={onToggleNav}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu />
        </button>

        <h1
          onClick={() => (window.location.href = "/pages/admin")}
          className="text-xl md:text-2xl font-semibold cursor-pointer"
        >
          Welcome, Admin!
        </h1>
      </div>

      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Logout
      </Button>
    </header>
  )
}
