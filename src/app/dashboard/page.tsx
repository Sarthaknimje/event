'use client';

import { useAuth } from '@/lib/hooks';
import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Redirect based on user role
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  }, [user, router]);

  // This component shows during the brief moment before redirect
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Redirecting to your dashboard...</h1>
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
}