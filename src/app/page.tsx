import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiFetchAuth } from '../utils/api';
import QuestCard from '../components/QuestCard';
import TaskList from '../components/TaskList';

type Adventurer = {
  adventurer_name: string;
  level: number;
  xp: number;
  adventure_rank: string;
  coins: number;
};

type Quest = {
  id: number;
  date: string;
  tasks: { description: string; is_completed: boolean }[];
  is_completed: boolean;
  reward_xp: number;
  reward_coins: number;
};

export default async function Dashboard() {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let adventurer: Adventurer | null = null;
  let quests: Quest[] = [];

  try {
    const adventurerData = await apiFetchAuth('/users/adventurer/', token);
    adventurer = adventurerData[0];
    quests = await apiFetchAuth('/quests/quests/', token);
    console.log(quests, "====================")
  } catch (err) {
    console.error('Failed to fetch data:', err);
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl mb-6">Guild Hall</h1>
      {adventurer && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl">
            {adventurer.adventurer_name}, {adventurer.adventure_rank}
          </h2>
          <p>Level: {adventurer.level} | XP: {adventurer.xp} | Coins: {adventurer.coins}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskList token={token} />
        <QuestCard quests={quests} token={token} />
      </div>
    </div>
  );
}