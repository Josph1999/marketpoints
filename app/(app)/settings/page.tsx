'use client';

import { useCardStore } from '@/store/useCardStore';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const router = useRouter();
  const { user, cards, logout } = useCardStore();

  const formattedPhone = user?.phoneNumber
    ? `+995 ${user.phoneNumber.slice(0, 3)} ${user.phoneNumber.slice(3, 6)} ${user.phoneNumber.slice(6)}`
    : '';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen px-6 pt-14">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Account
        </h2>
        <div className="bg-white/5 rounded-2xl divide-y divide-white/5">
          <div className="p-4">
            <p className="text-white text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-gray-500 text-sm">{formattedPhone}</p>
          </div>
          <div className="p-4 flex items-center justify-between">
            <p className="text-white text-sm font-medium">Cards saved</p>
            <p className="text-gray-500 text-sm">{cards.length}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          About
        </h2>
        <div className="bg-white/5 rounded-2xl divide-y divide-white/5">
          <div className="p-4">
            <p className="text-white text-sm font-medium">MarketPoints</p>
            <p className="text-gray-500 text-sm">Version 1.0.0</p>
          </div>
          <div className="p-4">
            <p className="text-gray-400 text-sm">
              Your loyalty cards, all in one place. Never fumble at checkout again.
            </p>
          </div>
        </div>
      </section>

      <Button
        onClick={handleLogout}
        variant="secondary"
        className="w-full !text-red-400 !border-red-500/20"
        size="md"
      >
        Sign out
      </Button>
    </div>
  );
}
