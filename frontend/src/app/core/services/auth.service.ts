import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/models';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'burrito_token'; 
  private readonly userKey = 'burrito_user'; 
  private readonly currentUser = signal<User | null>(this.readUser());
  readonly user = this.currentUser.asReadonly(); 
  
 readonly isAuthenticated =
computed(

()=>

!!this.token

);
  
  readonly isAdmin = computed(() => this.currentUser()?.rol === 'admin');
  constructor(private readonly http: HttpClient) {}
  get token(): string | null { return localStorage.getItem(this.tokenKey); }
  login(data: LoginRequest): Observable<AuthResponse> { return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(tap(r => this.saveSession(r))); }
  register(data: RegisterRequest): Observable<User> { return this.http.post<User>(`${environment.apiUrl}/auth/register`, data); }
  logout(): void { localStorage.removeItem(this.tokenKey); localStorage.removeItem(this.userKey); this.currentUser.set(null); }
  private saveSession(
r: AuthResponse
): void {

localStorage.setItem(
this.tokenKey,
r.access_token
);

if (r.user){

localStorage.setItem(

this.userKey,

JSON.stringify(
r.user
)

);

this.currentUser.set(
r.user
);

}

}
  private readUser(): User | null { try { const value = localStorage.getItem(this.userKey); return value ? JSON.parse(value) as User : null; } catch { return null; } }
}
