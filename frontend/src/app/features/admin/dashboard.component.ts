import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DashboardStats } from '../../core/models/models';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'admin-dashboard',
  imports: [DecimalPipe],
  template: `
    <div class="mb-4">
      <h4 class="fw-bold mb-1">Dashboard</h4>
      <p class="text-muted mb-0">El pulso de tu biblioteca, de un vistazo.</p>
    </div>

    @if (stats(); as s) {
      <div class="stats-grid">
        <div class="card">
          <div class="card-body d-flex align-items-center gap-3">
            <span class="stat-icon bg-label-primary"><i class="bx bx-user"></i></span>
            <div>
              <h3 class="card-title mb-1">{{ s.lectores }}</h3>
              <span class="text-muted">Lectores registrados</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body d-flex align-items-center gap-3">
            <span class="stat-icon bg-label-info"><i class="bx bx-book"></i></span>
            <div>
              <h3 class="card-title mb-1">{{ s.libros }}</h3>
              <span class="text-muted">Libros publicados</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body d-flex align-items-center gap-3">
            <span class="stat-icon bg-label-warning"><i class="bx bx-star"></i></span>
            <div>
              <h3 class="card-title mb-1">{{ s.promedioRating | number: '1.1-1' }}</h3>
              <span class="text-muted">Promedio de rating</span>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="card state-card text-center text-muted">Cargando estadísticas…</div>
    }
  `,
})
export class DashboardComponent {
  readonly stats = signal<DashboardStats | null>(null);

  constructor() {
    inject(AdminService)
      .dashboard()
      .subscribe((stats) => this.stats.set(stats));
  }
}
