'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/api/client';
import useAuth from '@/hooks/useAuth';
import Auth from '@/components/auth/Auth';

export default function CheckUser() {
  // ==================== CHECK HOOK SESSION =====================
  const { user, loading } = useAuth(); 

  const router = useRouter();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          // not login setcheck fail
          setCheckingRole(false);
          return;
        }

        try {
          // getting role from staff
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

          // redirect by role
          if (role === 'admin') router.push('/pages/admin');
          else if (role === 'staff') router.push('/pages/staff');
          else setCheckingRole(false); // orther role are invalid

        } catch (err) {
          console.error(err);
          setCheckingRole(false);
        }
      }
    };

    checkAccess();
  }, [user, loading, router]);

  if (loading || checkingRole) return <h1>Loading...</h1>;

  // not login or role invalid -> redirect to signin form or page by role
  return <Auth />;
}
