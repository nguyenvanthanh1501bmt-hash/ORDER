'use client';

import { useRouter } from 'next/navigation';
import client from '@/api/client';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function AdminPage() {
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

  // Hàm logout
  const handleLogout = async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        return;
      }
      // Sau khi logout → về trang login
      router.push('/'); // hoặc trang login admin nếu bạn tạo riêng
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
