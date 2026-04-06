import { Injectable } from '@angular/core';

interface UserAccount {
  email: string;
  password: string;
  name: string;
}

const USERS_KEY = 'homefinder_users';
const CURRENT_USER_KEY = 'homefinder_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users: UserAccount[] = this.readUsers();

  get currentUserEmail(): string | null {
    return localStorage.getItem(CURRENT_USER_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserEmail;
  }

  register(name: string, email: string, password: string): { ok: boolean; message?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    this.users.push({ name: name.trim(), email: normalizedEmail, password });
    this.writeUsers(this.users);
    localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);
    return { ok: true };
  }

  login(email: string, password: string): { ok: boolean; message?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email === normalizedEmail);
    if (!user || user.password !== password) {
      return { ok: false, message: 'Invalid email or password.' };
    }

    localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  private readUsers(): UserAccount[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as UserAccount[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeUsers(users: UserAccount[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}
