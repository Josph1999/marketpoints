'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCardStore } from '@/store/useCardStore';
import BottomNav from '@/components/ui/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, authLoaded, loadAuth, fetchCards } = useCardStore();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      fetchCards();
    }
  }, [authLoaded, isAuthenticated, router, fetchCards]);

  if (!authLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
