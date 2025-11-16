'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/api/client';
import useAuth from '@/hooks/useAuth';
import Auth from '@/components/auth/Auth';

export default function CheckUser() {
  const { user, loading } = useAuth(); // hook check session
  const router = useRouter();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          // Chưa login → hiển thị Auth
          setCheckingRole(false);
          return;
        }

        try {
          // Lấy role từ bảng staff
          const { data: staffData, error: staffError } = await client
            .from('staff')
            .select('role')
            .eq('email', user.email)
            .single();

          if (staffError || !staffData) {
            setCheckingRole(false);
            return;
          }

          const role = staffData.role;

          // Redirect theo role
          if (role === 'admin') router.push('/pages/admin');
          else if (role === 'staff') router.push('/pages/staff');
          else setCheckingRole(false); // role khác → vẫn hiển thị Auth

        } catch (err) {
          console.error(err);
          setCheckingRole(false);
        }
      }
    };

    checkAccess();
  }, [user, loading, router]);

  if (loading || checkingRole) return <h1>Loading...</h1>;

  // Nếu chưa login hoặc role không hợp lệ → hiển thị login/signup
  return <Auth />;
}
