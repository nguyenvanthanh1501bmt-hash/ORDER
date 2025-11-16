'use client'

import { useRouter } from 'next/navigation';
import client from '@/api/client';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        return;
      }
      router.push('/'); // về Home/login sau logout
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-4">
      <h1>Hello</h1>
      {user && (
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </div>
  );
}
