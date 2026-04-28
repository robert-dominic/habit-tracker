import { USERS_KEY, SESSION_KEY, HABITS_KEY } from "./constants";

import type { User, Session } from "@/types/auth";
import type { Habit } from "@/types/habit";

// Get users
export function getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
}

// Save users 
export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get session
export function getSession(): Session | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
}

// Save session
export function saveSession(session: Session): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Clear session
export function clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
}

// Get habits
export function getHabits(): Habit[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
}

// Save habits
export function saveHabits(habits: Habit[]): void {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}
