import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to store token/logged-in user
  private readonly _currentUser = signal<string | null>(null);

  // Read-only signals for public consumption
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  constructor() {
    // Restore session if exists
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('nook_staff_user');
      if (savedUser) {
        this._currentUser.set(savedUser);
      }
    }
  }

  login(username: string, password: string): boolean {
    // Simple client-side mock credentials check
    if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
      this._currentUser.set(username);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('nook_staff_user', username);
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('nook_staff_user');
    }
  }
}
