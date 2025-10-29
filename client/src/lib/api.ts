async function getAuthHeaders() {
  try {
    // Wait for Supabase client initialization
    if (globalThis.__supabaseInitPromise) {
      await globalThis.__supabaseInitPromise;
    }
    
    const client = globalThis.__supabaseClient;
    if (!client || !client.auth) {
      return { 'Content-Type': 'application/json' };
    }
    
    const { data: { session } } = await client.auth.getSession();
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return { 'Content-Type': 'application/json' };
  }
}

export async function apiRequest(url: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Level APIs
export const levelApi = {
  getAll: () => apiRequest('/api/levels'),
  getByTrack: (track: string) => apiRequest(`/api/levels?track=${track}`),
  getLevel: (track: string, number: number) => apiRequest(`/api/levels/${track}/${number}`),
  create: (data: any) => apiRequest('/api/levels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/api/levels/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/api/levels/${id}`, { method: 'DELETE' }),
};

// Progress APIs
export const progressApi = {
  getAll: () => apiRequest('/api/progress'),
  getByTrack: (track: string) => apiRequest(`/api/progress?track=${track}`),
  getLevelProgress: (track: string, number: number) => apiRequest(`/api/progress/${track}/${number}`),
  getStreak: () => apiRequest('/api/progress/streak'),
  create: (data: any) => apiRequest('/api/progress', { method: 'POST', body: JSON.stringify(data) }),
};

// Dashboard APIs
export const dashboardApi = {
  getStats: () => apiRequest('/api/dashboard/stats'),
  getNextTopic: () => apiRequest('/api/dashboard/next-topic'),
};

// Profile APIs
export const profileApi = {
  get: () => apiRequest('/api/profile'),
  update: (data: any) => apiRequest('/api/profile', { method: 'PATCH', body: JSON.stringify(data) }),
};

// Waitlist API
export const waitlistApi = {
  add: (email: string) => apiRequest('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) }),
};
