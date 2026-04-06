// Change this to your deployed Vercel URL
const API_BASE = __DEV__
  ? 'http://localhost:3000'
  : 'https://marketpoints-roan.vercel.app';

export async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return res;
}

export async function apiAuth(path: string, token: string, options?: RequestInit) {
  return api(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}
