import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Dummy users for authentication
  private dummyUsers: User[] = [
    { id: 1, username: 'admin', email: 'admin@company.com', role: 'admin' },
    { id: 2, username: 'manager', email: 'manager@company.com', role: 'manager' },
    { id: 3, username: 'user', email: 'user@company.com', role: 'user' }
  ];

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Dummy authentication - in real app, this would call an API
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager123' },
      { username: 'user', password: 'user123' }
    ];

    const isValid = validCredentials.some(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );

    if (isValid) {
      const user = this.dummyUsers.find(u => u.username === credentials.username)!;
      const response: LoginResponse = {
        user,
        token: `dummy-token-${user.id}-${Date.now()}`
      };

      return of(response).pipe(
        delay(1000), // Simulate API delay
        map(res => {
          this.setCurrentUser(res.user, res.token);
          return res;
        })
      );
    }

    throw new Error('Invalid credentials');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    
    if (userStr && token) {
      const user: User = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }
}