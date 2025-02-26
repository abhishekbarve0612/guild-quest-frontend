import { jwtDecode } from 'jwt-decode';

export const API_BASE_URL = 'http://localhost:8000/api';

async function refreshToken(refresh: string): Promise<{ access: string, refresh: string }> {
  const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) throw new Error('Token refresh failed');
  return response.json();
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    cache: 'no-store',
  });
  return response.json();
}

export async function apiFetchAuth(endpoint: string, token: string, refresh: string, options: RequestInit = {}): Promise<{
  data: any;
  newTokens?: { access: string, refresh: string };
}> {
  const decoded: { exp: number } = jwtDecode(token);
  const now = Math.floor(Date.now() / 1000); // Seconds
  const timeLeft = decoded.exp - now; // Seconds until expiry

  let currentToken = token;
  let newTokens: { access: string, refresh: string } | undefined;

  // Refresh if <5 minutes (300s) left
  if (timeLeft < 300) {
    newTokens = await refreshToken(refresh);
    currentToken = newTokens.access;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${currentToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return { data, newTokens };
}