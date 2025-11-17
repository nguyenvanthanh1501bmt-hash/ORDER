'use client'

import { Button } from '@/components/ui/button'
import client from '@/api/client'
import useRoleRedirect from '@/hooks/useRoleRedirect'

export default function AdminPage() {
  // Hook kiểm tra role 'admin'
  const { user, loading, checkingRole } = useRoleRedirect('admin')

  if (loading || checkingRole) return <h1>Loading...</h1>
  if (!user) return null // đang redirect

  const handleLogout = async () => {
    try {
      const { error } = await client.auth.signOut()
      if (error) {
        console.error('Logout error:', error.message)
        return
      }
      window.location.href = '/' // redirect sau logout
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div className="p-4">
      <h1>Welcome, Admin!</h1>
      <Button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white"
      >
        Logout
      </Button>
    </div>
  )
}
