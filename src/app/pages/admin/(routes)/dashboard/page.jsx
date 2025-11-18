'use client'

import { Button } from '@/components/ui/button'
import client from '@/api/client'

export default function AdminPage() {
  
  const handleLogout = async () => {
    const { error } = await client.auth.signOut()
    if (!error) window.location.href = '/'
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Welcome, Admin!</h1>

      <Button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white"
      >
        Logout
      </Button>
    </div>
  )
}
