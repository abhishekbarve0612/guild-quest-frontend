'use client';

import { logoutAction } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
        await logoutAction();
        router.refresh(); // Ensure client state syncs (optional, since redirect should handle it)
    });
  };

  return (
    <nav className="bg-ink text-white p-4 flex justify-between">
      <h1 className="text-xl">GuildQuest</h1>
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="hover:text-gold transition disabled:opacity-50"
      >
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    </nav>
  );
}