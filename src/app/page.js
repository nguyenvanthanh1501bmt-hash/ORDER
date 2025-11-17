'use client'

import { useRouter } from 'next/navigation';
import client from '@/api/client';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-4">
      <h1>Hello 1111</h1>
    </div>
  );
}
