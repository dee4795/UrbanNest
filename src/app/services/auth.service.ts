import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

const CURRENT_USER_KEY = 'urbannest_current_user';
const TOKEN_KEY = 'urbannest_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  get currentUserEmail(): string | null {
    return localStorage.getItem(CURRENT_USER_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserEmail;
  }

  register(
    name: string,
    email: string,
    password: string
  ): import('rxjs').Observable<{ ok: boolean; message?: string }> {
    return this.http
      .post<{ token: string; email: string }>('/api/auth/register', { name, email, password })
      .pipe(
        map((res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(CURRENT_USER_KEY, res.email);
          return { ok: true } as const;
        }),
        catchError((err) =>
          of({ ok: false, message: err?.error?.message ?? 'Unable to register.' } as const)
        )
      );
  }

  login(email: string, password: string): import('rxjs').Observable<{ ok: boolean; message?: string }> {
    return this.http.post<{ token: string; email: string }>('/api/auth/login', { email, password }).pipe(
      map((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(CURRENT_USER_KEY, res.email);
        return { ok: true } as const;
      }),
      catchError((err) => of({ ok: false, message: err?.error?.message ?? 'Unable to login.' } as const))
    );
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}
