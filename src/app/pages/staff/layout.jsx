'use client'

import StaffHeader from "../../components/layout/staffheader"
import useRoleRedirect from "@/hooks/useRoleRedirect"

export default function DashboardLayout({ children }) {
    const { user, loading, checkingRole } = useRoleRedirect('staff')

    if (loading || checkingRole) return <h1>Loading...</h1>
    if (!user) return null // đang redirect

    return (
        <div>
            <StaffHeader />
            <main>{children}</main>  {/* <-- render page.jsx */}
        </div>
    )
}
