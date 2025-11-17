'use client';

import { useRouter } from 'next/navigation';
import client from '@/api/client';
import useAuth from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading) {
        if (!user) {
          router.push('/pages'); // chưa login → redirect
          return;
        }

        try {
          const { data: staffData, error } = await client
            .from('staff')
            .select('role')
            .eq('email', user.email)
            .single();

          if (error || !staffData || staffData.role !== 'admin') {
            // không phải admin → redirect
            router.push('/pages'); 
            return;
          }

          setCheckingRole(false); // là admin → render trang
        } catch (err) {
          console.error(err);
          router.push('/pages'); // lỗi → redirect
        }
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || checkingRole) return <h1>Loading...</h1>;
  if (!user) return null; // đang redirect

  const handleLogout = async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        return;
      }
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h1>Welcome, Admin!</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
