import { Component, inject, signal } from '@angular/core';
import { AffinityItem } from '../../core/models/models';
import { RatingsService } from '../../core/services/ratings.service';

@Component({
  selector: 'app-affinity',
  template: `
    <div class="mb-4">
      <h4 class="fw-bold mb-1">Afinidad con otros burritos lectores</h4>
      <p class="text-muted mb-0">Coincidencias basadas en libros que ambos puntuaron de forma parecida.</p>
    </div>

    @if (loading()) {
      <div class="card state-card text-center text-muted">Calculando afinidades…</div>
    } @else if (items().length) {
      <div class="card">
        <div class="table-responsive text-nowrap">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>Título</th>
                <th>Lector</th>
                <th>Su rating</th>
                <th>Mi rating</th>
              </tr>
            </thead>
            <tbody class="table-border-bottom-0">
              @for (item of items(); track item.libroId + '-' + item.lector) {
                <tr>
                  <td><strong>{{ item.titulo }}</strong></td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar avatar-sm me-2">
                        <span class="avatar-initial rounded-circle bg-label-primary">{{ item.lector.charAt(0) }}</span>
                      </div>
                      {{ item.lector }}
                    </div>
                  </td>
                  <td><span class="rating-text">{{ stars(item.suPuntuacion) }}</span></td>
                  <td><span class="rating-text">{{ stars(item.miPuntuacion) }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    } @else {
      <div class="card state-card text-center">
        <div class="avatar mx-auto mb-3">
          <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-heart fs-3"></i></span>
        </div>
        <h5 class="mb-2">Aún no hay coincidencias</h5>
        <p class="text-muted mb-0">
          Puntúa algunos libros desde la galería. Cuando otros lectores valoren los mismos títulos, aquí aparecerán
          los gustos más afines.
        </p>
      </div>
    }
  `,
})
export class AffinityComponent {
  readonly items = signal<AffinityItem[]>([]);
  readonly loading = signal(true);

  constructor() {
    inject(RatingsService)
      .affinity()
      .subscribe({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  stars(score: number): string {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  }
}
