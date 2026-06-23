import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <aside class="layout-menu menu-vertical menu bg-menu-theme">
          <div class="app-brand demo">
            <a class="app-brand-link" routerLink="/admin/dashboard">
              <span class="app-brand-logo">B</span>
              <span class="app-brand-text demo menu-text fw-bolder ms-2">Burrito Admin</span>
            </a>
          </div>

          <ul class="menu-inner py-1">
            <li class="menu-header small text-uppercase">
              <span class="menu-header-text">Administración</span>
            </li>
            <li class="menu-item" routerLinkActive="active">
              <a class="menu-link" routerLink="/admin/dashboard">
                <i class="menu-icon tf-icons bx bx-home-circle"></i>
                <div class="menu-text">Dashboard</div>
              </a>
            </li>
            <li class="menu-item" routerLinkActive="active">
              <a class="menu-link" routerLink="/admin/libros">
                <i class="menu-icon tf-icons bx bx-book"></i>
                <div class="menu-text">Libros</div>
              </a>
            </li>
            <li class="menu-header small text-uppercase">
              <span class="menu-header-text">Sesión</span>
            </li>
            <li class="menu-item">
              <button class="menu-link border-0 bg-transparent w-100 text-start" type="button" (click)="logout()">
                <i class="menu-icon tf-icons bx bx-log-out"></i>
                <div class="menu-text">Salir</div>
              </button>
            </li>
          </ul>
        </aside>

        <div class="layout-page">
          <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme">
            <div class="navbar-nav-right d-flex align-items-center w-100">
              <div>
                <span class="fw-semibold">Panel administrador</span>
                <small class="text-muted d-block">Gestión del catálogo</small>
              </div>
              <div class="navbar-nav align-items-center ms-auto">
                <div class="avatar avatar-online">
                  <span class="avatar-initial rounded-circle bg-primary">{{ auth.user()?.nombre?.charAt(0) || 'A' }}</span>
                </div>
                <div class="ms-2 d-none d-sm-block">
                  <span class="fw-semibold">{{ auth.user()?.nombre || 'Admin' }}</span>
                  <small class="text-muted d-block">Administrador</small>
                </div>
              </div>
            </div>
          </nav>

          <div class="content-wrapper">
            <main class="container-xxl flex-grow-1 container-p-y">
              <router-outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
