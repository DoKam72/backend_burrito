import { inject } from '@angular/core'; import { CanActivateFn, Router } from '@angular/router'; import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = () => { const a = inject(AuthService); return a.isAuthenticated() ? true : inject(Router).createUrlTree(['/login']); };
export const adminGuard: CanActivateFn = () => { const a = inject(AuthService); if (!a.isAuthenticated()) return inject(Router).createUrlTree(['/login']); return a.isAdmin() ? true : inject(Router).createUrlTree(['/galeria']); };
export const guestGuard: CanActivateFn = () => { const a = inject(AuthService); return !a.isAuthenticated() ? true : inject(Router).createUrlTree([a.isAdmin() ? '/admin/dashboard' : '/galeria']); };
