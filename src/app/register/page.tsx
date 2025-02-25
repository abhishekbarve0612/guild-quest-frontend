import { redirect } from 'next/navigation';
import { apiFetch } from '../../utils/api';

// Client Component for form handling
async function RegisterForm() {
  async function handleSubmit(formData: FormData) {
    'use server'; // Server Action (Next.js 15/React 19)
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await apiFetch('/users/register/', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      redirect('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      // TODO: Error state (use client-side state if needed)
    }
  }

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
        type="email"
        name="email"
        placeholder="Email"
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
      <button type="submit" className="w-full bg-gold text-white p-2 rounded hover:bg-yellow-600 transition">
        Register
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4">Join the Guild</h1>
        <RegisterForm />
      </div>
    </div>
  );
}