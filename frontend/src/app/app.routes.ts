import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'galeria' },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'registro', canActivate: [guestGuard], loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: '', canActivate: [authGuard], loadComponent: () => import('./layout/app-shell.component').then(m => m.AppShellComponent), children: [
    { path: 'galeria', loadComponent: () => import('./features/books/gallery.component').then(m => m.GalleryComponent) },
    { path: 'galeria/:id', loadComponent: () => import('./features/books/book-detail.component').then(m => m.BookDetailComponent) },
    { path: 'afinidad', loadComponent: () => import('./features/affinity/affinity.component').then(m => m.AffinityComponent) },
  ]},
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./layout/admin-shell.component').then(m => m.AdminShellComponent), children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'libros', loadComponent: () => import('./features/admin/books-admin.component').then(m => m.BooksAdminComponent) },
    { path: 'libros/agregar', loadComponent: () => import('./features/admin/book-form.component').then(m => m.BookFormComponent) },
    { path: 'libros/editar/:id', loadComponent: () => import('./features/admin/book-form.component').then(m => m.BookFormComponent) },
    { path: 'libros/eliminar/:id', loadComponent: () => import('./features/admin/book-delete.component').then(m => m.BookDeleteComponent) },
  ]},
  { path: '**', redirectTo: 'galeria' },
];
