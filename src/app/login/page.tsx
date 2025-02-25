import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';
import { apiFetch } from '@/utils/api';

// Server Action for login
async function loginAction(formData: FormData) {
  'use server';
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const { access } = await apiFetch('/token/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  const cookieStore = await cookies();
  cookieStore.set('token', access, { httpOnly: true, secure: true, path: '/' });
  redirect('/');
}

export default async function LoginPage() {
  const token = (await cookies()).get('token')?.value;
  if (token) {
    redirect('/'); // Redirect if already logged in
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4">Enter the Guild</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <LoginForm loginAction={loginAction} />
        </Suspense>
      </div>
    </div>
  );
}