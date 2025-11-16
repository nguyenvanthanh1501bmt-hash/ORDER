'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/api/client';
import useAuth from '@/hooks/useAuth';

export default function StaffPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // redirect sang /pages nếu chưa login
      router.push('/pages');
    }
  }, [user, loading, router]);

  if (loading) return <h1>Loading...</h1>;
  if (!user) return null; // đang redirect → không render gì

  const handleLogout = async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        return;
      }
      router.push('/staff');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h1>Welcome, Staff!</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
