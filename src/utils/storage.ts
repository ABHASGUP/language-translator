import type { UserType } from '../types';

const STORAGE_KEY = 'linguaquest_user_data';

export function saveUserData(user: UserType): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function loadUserData(): UserType | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUserData(): void {
  localStorage.removeItem(STORAGE_KEY);
}