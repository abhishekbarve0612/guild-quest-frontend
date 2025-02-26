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
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const refresh = cookieStore.get('refresh')?.value;
  if (!token || !refresh) {
    console.log("Redirecting to /login - tokens missing");
    redirect('/login');
  }

  let adventurer: Adventurer | null = null;
  let quests: Quest[] = [];
  let welcomeLetter: string = '';

  const updateAccessAndRefreshTokens = (tokens: { access: string; refresh: string }) => {
    console.log("Updating tokens:", tokens);
    cookieStore.set('token', tokens.access, { httpOnly: true, secure: true, path: '/' });
    cookieStore.set('refresh', tokens.refresh, { httpOnly: true, secure: true, path: '/' });
  };

  try {
    const adventurerRes = await apiFetchAuth('/users/adventurer/', token, refresh);
    adventurer = adventurerRes.data[0];
    if (adventurerRes.newTokens) updateAccessAndRefreshTokens(adventurerRes.newTokens);

    const questsRes = await apiFetchAuth('/quests/quests/', token, refresh);
    quests = questsRes.data;
    if (questsRes.newTokens) updateAccessAndRefreshTokens(questsRes.newTokens);

    const welcomeRes = await apiFetchAuth('/llm/welcome-letter/', token, refresh, {
      method: 'POST',
      body: JSON.stringify({ adventurer_name: adventurer?.adventurer_name }),
    });
    welcomeLetter = welcomeRes.data.letter;
    if (welcomeRes.newTokens) updateAccessAndRefreshTokens(welcomeRes.newTokens);
  } catch (err: any) {
    if (err.message === 'Unauthorized') redirect('/login');
    throw err;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl mb-6">Guild Hall</h1>
      {adventurer && (
        <>
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <p className="italic">{welcomeLetter}</p>
            </div>
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl">
              {adventurer.adventurer_name}, {adventurer.adventure_rank}
            </h2>
            <p>Level: {adventurer.level} | XP: {adventurer.xp} | Coins: {adventurer.coins}</p>
          </div>
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskList token={token} refresh={refresh} />
        <QuestCard quests={quests} token={token} refresh={refresh} />
      </div>
    </div>
  );
}