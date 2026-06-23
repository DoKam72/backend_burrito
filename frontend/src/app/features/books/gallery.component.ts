import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../core/models/models';
import { BooksService } from '../../core/services/books.service';
import { BookCardComponent } from '../../shared/book-card.component';

@Component({
  selector: 'app-gallery',
  imports: [BookCardComponent, FormsModule],
  template: `
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h4 class="fw-bold mb-1">Galería de libros</h4>
        <p class="text-muted mb-0">Encuentra tu próxima lectura entre nuestra colección.</p>
      </div>

      <div class="input-group input-group-merge w-auto">
        <span class="input-group-text"><i class="bx bx-search"></i></span>
        <input
          class="form-control"
          [(ngModel)]="query"
          placeholder="Buscar título, autor o género"
          aria-label="Buscar libros"
        />
      </div>
    </div>

    @if (loading()) {
      <div class="card state-card text-center text-muted">Cargando biblioteca…</div>
    } @else if (error()) {
      <div class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
        <span>{{ error() }}</span>
        <button class="btn btn-sm btn-outline-danger" type="button" (click)="load()">Reintentar</button>
      </div>
    } @else if (!filtered().length) {
      <div class="card state-card text-center text-muted">No encontramos libros con esa búsqueda.</div>
    } @else {
      <div class="book-grid">
        @for (book of filtered(); track book.id) {
          <book-card [book]="book" />
        }
      </div>
    }
  `,
})
export class GalleryComponent {
  private readonly service = inject(BooksService);
  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly query = signal('');
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.books().filter((b) => `${b.titulo} ${b.autores} ${b.genero}`.toLowerCase().includes(q)) : this.books();
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.list().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar la biblioteca. El servidor puede estar despertando.');
        this.loading.set(false);
      },
    });
  }
}
