import { apiFetchAuth } from "@/utils/api";

type Task = {
  id: number;
  description: string;
  is_completed: boolean;
};

export default async function TaskList({ token, refresh }: { token: string; refresh: string; }) {
  const tasks: Task[] = await apiFetchAuth('/tasks/tasks/', token, refresh);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl mb-4">Tasks</h2>
      <ul>
        {Array.isArray(tasks) && tasks.map((task) => (
          <li key={task.id} className="mb-2">
            <input type="checkbox" checked={task.is_completed} readOnly />
            <span className={task.is_completed ? 'line-through' : ''}>{task.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}