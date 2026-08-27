export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.chefu.co.za';
export const ACCOUNT_APP_URL = import.meta.env.VITE_ACCOUNT_APP_URL || 'https://myaccount.chefu.co.za';

export function apiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function readApiError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
    requestId?: string;
  };
  const message = data.error || data.message || fallback;
  return data.requestId ? `${message} Request ID: ${data.requestId}` : message;
}

export function accountLoginUrl(returnTo: string) {
  const url = new URL('/login', ACCOUNT_APP_URL);
  url.searchParams.set('app', 'admin');
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}

export function accountLogoutUrl(returnTo: string) {
  const url = new URL('/logout', ACCOUNT_APP_URL);
  url.searchParams.set('app', 'admin');
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}
