'use client'

import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import useRoleRedirect from '@/hooks/useRoleRedirect'
import SideNav from './components/sidenav'

export default function DashboardLayout({ children }){
    const { user, loading, checkingRole } = useRoleRedirect('admin')
    
    if (loading || checkingRole) return <h1>Loading...</h1>
    if (!user) return null // đang redirect

    return(
        <div className="flex h-screen">
            {/* Sidebar bên trái */}
            <SideNav />

            {/* Phần còn lại của màn hình */}
            <div className="flex-1 flex flex-col">
                {/* Header phía trên */}
                {/* Nội dung chính của từng page */}
                <main className="p-5 flex-1 overflow-auto">
                    {children}  {/* Đây là nơi page (ví dụ page.jsx) được render */}
                </main>
            </div>
        </div>
    )
}