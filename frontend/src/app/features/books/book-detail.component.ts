import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book, BookRating } from '../../core/models/models';
import { BooksService } from '../../core/services/books.service';
import { RatingsService } from '../../core/services/ratings.service';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink],
  template: `
    <a class="btn btn-sm btn-outline-primary mb-4" routerLink="/galeria">
      <i class="bx bx-left-arrow-alt me-1"></i>
      Volver a la galería
    </a>

    @if (book(); as item) {
      <div class="card">
        <div class="card-body p-4 p-xl-5">
          <div class="row g-4 g-xl-5">
            <div class="col-lg-4">
              @if (books.imageUrl(item.imagen); as cover) {
                <img class="detail-cover shadow-sm" [src]="cover" [alt]="item.titulo" />
              } @else {
                <div class="cover-placeholder detail-placeholder">
                  <i class="bx bx-book-open"></i>
                </div>
              }
            </div>

            <div class="col-lg-8">
              <span class="badge bg-label-primary mb-3">{{ item.genero }}</span>
              <h3 class="fw-bold mb-2">Reseña de Libro: {{ item.titulo }}</h3>
              <p class="text-muted mb-4">por <strong>{{ item.autores }}</strong></p>

              <div class="row g-3 mb-4">
                <div class="col-sm-4">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted text-uppercase">Editorial</small>
                    <div class="fw-semibold">{{ item.editorial }}</div>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted text-uppercase">Género</small>
                    <div class="fw-semibold">{{ item.genero }}</div>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted text-uppercase">Promedio</small>
                    <div class="fw-semibold">{{ rating()?.promedio?.toFixed(1) || 'Sin votos' }}</div>
                  </div>
                </div>
              </div>

              <div class="alert alert-primary d-flex flex-column flex-md-row align-items-md-center gap-3">
                <strong class="me-md-2">Mi puntuación</strong>
                <div class="rating-stars">
                  @for (star of stars; track star) {
                    <button
                      type="button"
                      [class.selected]="star <= (rating()?.miPuntuacion ?? 0)"
                      (click)="rate(star)"
                      [attr.aria-label]="star + ' estrellas'"
                    >
                      ★
                    </button>
                  }
                </div>
                <small class="ms-md-auto">{{ rating()?.total || 0 }} puntuaciones</small>
              </div>

              <hr class="my-4" />
              <h5 class="fw-bold">Sinopsis</h5>
              <p class="lh-lg mb-0">{{ item.sinopsis }}</p>
            </div>
          </div>
        </div>
      </div>
    } @else if (error()) {
      <div class="alert alert-danger" role="alert">{{ error() }}</div>
    } @else {
      <div class="card state-card text-center text-muted">Cargando reseña…</div>
    }
  `,
})
export class BookDetailComponent {
  readonly books = inject(BooksService);
  private readonly ratings = inject(RatingsService);
  readonly book = signal<Book | null>(null);
  readonly rating = signal<BookRating | null>(null);
  readonly error = signal('');
  readonly stars = [1, 2, 3, 4, 5];
  private readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  constructor() {
    this.books.get(this.id).subscribe({
      next: (book) => this.book.set(book),
      error: () => this.error.set('No encontramos este libro.'),
    });
    this.loadRating();
  }

  rate(score: number): void {
    this.ratings.rate(this.id, score).subscribe(() => this.loadRating());
  }

  private loadRating(): void {
    this.ratings.getBookRating(this.id).subscribe((rating) => this.rating.set(rating));
  }
}
