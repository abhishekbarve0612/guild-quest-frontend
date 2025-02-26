'use client';

import { useTransition } from 'react';
import { apiFetchAuth } from '@/utils/api';

type Quest = {
  id: number;
  date: string;
  tasks: { description: string; is_completed: boolean }[];
  is_completed: boolean;
  reward_xp: number;
  reward_coins: number;
};

export default function QuestCard({ quests, token, refresh }: { quests: Quest[]; token: string; refresh: string; }) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = (id: number) => {
    startTransition(async () => {
        try {
            const res = await apiFetchAuth(`/quests/quests/${id}/complete/`, token, refresh, { method: 'POST' });
            if (res.newTokens) {
                console.log("QuestCard: New tokens received, reloading");
              // Client-side can't update httpOnly cookies directly—rely on server updates or refresh page
              window.location.reload();
            }
        } catch (err: any) {
                console.log("QuestCard error:", err.message);
                if (err.message === 'Unauthorized') window.location.href = '/login';
        }
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl mb-4">Quests</h2>
      {Array.isArray(quests) && quests.map((quest) => (
        <div key={quest.id} className="mb-4 p-4 border rounded">
          <p>Date: {quest.date}</p>
          <ul>
            {quest.tasks.map((task, idx) => (
              <li key={idx}>{task.description} {task.is_completed ? '(Done)' : ''}</li>
            ))}
          </ul>
          <p>Reward: {quest.reward_xp} XP, {quest.reward_coins} Coins</p>
          {!quest.is_completed && (
            <button
              onClick={() => handleComplete(quest.id)}
              disabled={isPending}
              className="mt-2 bg-gold text-white p-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {isPending ? 'Completing...' : 'Complete'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}