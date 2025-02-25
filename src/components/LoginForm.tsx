'use client';

import { useState, useTransition } from 'react';

type LoginAction = (formData: FormData) => Promise<void>;

export default function LoginForm({ loginAction }: { loginAction: LoginAction }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await loginAction(formData);
      } catch (err) {
        setError('Login failed: Invalid credentials');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gold text-white p-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}