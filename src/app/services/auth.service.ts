import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

export type LoginResponse = unknown;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = 'http://elamircloud.elamirgroup.com:n5050/api/AccountUser/login';
  private readonly storageKey = 'it-assets-auth-session';

  // login(username: string, password: string, rememberMe = false): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(this.api, { username, password }).pipe(
  //     map((response) => {
  //       if (this.isRejectedResponse(response)) {
  //         throw new Error(this.getResponseMessage(response));
  //       }
  //       return response;
  //     }),
  //     tap((response) => this.saveSession(response, rememberMe)),
  //   );
  // }
  login(username: string, password: string, rememberMe = false): Observable<LoginResponse> {
  const storage = this.getStorage(
    rememberMe ? 'localStorage' : 'sessionStorage'
  );

  storage?.setItem(this.storageKey, JSON.stringify({
    username,
    role: 'Admin'
  }));

  storage?.setItem('isLoggedIn', 'true');
  storage?.setItem('token', 'temporary-test-token');
  storage?.setItem('username', username);
  storage?.setItem('userRole', 'Admin');

  return new Observable((observer) => {
    observer.next({
      success: true,
      username,
      role: 'Admin'
    });
    observer.complete();
  });
}




  logout(): void {
    for (const storageType of ['localStorage', 'sessionStorage'] as const) {
      const storage = this.getStorage(storageType);
      storage?.removeItem(this.storageKey);
      storage?.removeItem('isLoggedIn');
      storage?.removeItem('token');
      storage?.removeItem('username');
      storage?.removeItem('userRole');
    }
  }

 isLoggedIn(): boolean {
  const storageTypes: Array<'localStorage' | 'sessionStorage'> = [
    'localStorage',
    'sessionStorage',
  ];

  return storageTypes.some((storageType) => {
    const storage = this.getStorage(storageType);

    const isLoggedIn =
      storage?.getItem('isLoggedIn') === 'true';

    const token =
      storage?.getItem('token');

    return isLoggedIn && !!token;
  });
}

  private saveSession(response: LoginResponse, rememberMe: boolean): void {
    const storage = this.getStorage(rememberMe ? 'localStorage' : 'sessionStorage');
    storage?.setItem(this.storageKey, JSON.stringify(response ?? true));

    if (response && typeof response === 'object') {
      const body = response as Record<string, unknown>;
      const session = this.getSessionFields(body);
      storage?.setItem('isLoggedIn', 'true');
      if (session.token) {
        storage?.setItem('token', session.token);
      }
      if (session.username) {
        storage?.setItem('username', session.username);
      }
      if (session.userRole) {
        storage?.setItem('userRole', session.userRole);
      }
    }
  }

  private getSessionFields(body: Record<string, unknown>): {
    token?: string;
    username?: string;
    userRole?: string;
  } {
    const nested = body['data'];
    const data = nested && typeof nested === 'object' ? (nested as Record<string, unknown>) : body;
    return {
      token: this.readString(data, ['token', 'accessToken', 'jwt']),
      username: this.readString(data, ['username', 'userName']),
      userRole: this.readString(data, ['userRole', 'role']),
    };
  }

  private readString(body: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = body[key];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }
    return undefined;
  }

  private getStorage(type: 'localStorage' | 'sessionStorage'): Storage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return window[type];
  }

  private isRejectedResponse(response: LoginResponse): boolean {
    if (!response || typeof response !== 'object') {
      return response !== true;
    }

    const body = response as Record<string, unknown>;
    return body['success'] === false || body['isSuccess'] === false || body['authenticated'] === false;
  }

  private getResponseMessage(response: LoginResponse): string {
    if (response && typeof response === 'object') {
      const body = response as Record<string, unknown>;
      const message = body['message'] ?? body['error'] ?? body['errorMessage'];
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
    return 'بيانات تسجيل الدخول غير صحيحة';
  }
}
  