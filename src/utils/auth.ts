'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
    const cookieStore = await cookies();
    await cookieStore.delete('token');
    await cookieStore.delete('refresh');
    redirect('/login');
}