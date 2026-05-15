const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
  || 'http://localhost:8080';

export const API_BASE_URL = raw.replace(/\/$/, '');

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
