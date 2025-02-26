import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import LoginForm from '../../components/LoginForm';
import { API_BASE_URL } from '@/utils/api';

async function loginAction(formData: FormData) {
  'use server';
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials'); // Custom error for 401
  }

  const { access, refresh } = await response.json();
  const cookieStore = await cookies();
  await cookieStore.set('token', access, { httpOnly: true, secure: true, path: '/' });
  await cookieStore.set('refresh', refresh, { httpOnly: true, secure: true, path: '/' });

  const redirectPath = cookieStore.get('redirectAfterLogin')?.value || '/';
  await cookieStore.delete('redirectAfterLogin');
  redirect(redirectPath);
}

export default async function LoginPage() {
  const token = (await cookies()).get('token')?.value;
  if (token) redirect('/');

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