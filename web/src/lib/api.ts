export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
    credentials: 'include', // Envoie et reçoit les cookies HttpOnly
  });

  if (!response.ok) {
    let errorDetail = response.statusText || 'Une erreur est survenue';
    try {
      const errorData = await response.json();
      if (errorData?.detail || errorData?.message) {
        errorDetail = errorData.detail || errorData.message;
      }
    } catch {
      // Ignorer si la réponse n'est pas du JSON
    }
    throw new Error(errorDetail);
  }

  // Si 204 No Content ou réponse vide
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}