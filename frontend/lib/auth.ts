import { api } from './api';

export type AuthUser = {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  role_libelle?: string;
};

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
  if (typeof window !== 'undefined') window.location.href = '/login';
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await api.get('/auth/me');
  return data.user;
}