import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Book } from '../../core/models/models';
import { BooksService } from '../../core/services/books.service';

@Component({
  selector: 'admin-book-delete',
  imports: [RouterLink],
  template: `
    <div class="mb-4">
      <h4 class="fw-bold mb-1">Eliminar libro</h4>
      <p class="text-muted mb-0">Esta acción no se puede deshacer.</p>
    </div>

    @if (book(); as b) {
      <div class="card delete-card mx-auto text-center" style="max-width: 560px">
        <div class="avatar avatar-lg mx-auto mb-3">
          <span class="avatar-initial rounded-circle bg-label-danger"><i class="bx bx-error fs-3"></i></span>
        </div>
        <h4 class="mb-2">¿Eliminar “{{ b.titulo }}”?</h4>
        <p class="text-muted mb-4">Se retirará el libro de la galería y también se eliminará su portada.</p>

        <div class="d-flex justify-content-center gap-2">
          <a class="btn btn-label-secondary" routerLink="/admin/libros">Cancelar</a>
          <button class="btn btn-danger" [disabled]="deleting()" (click)="remove()">
            {{ deleting() ? 'Eliminando…' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    } @else {
      <div class="card state-card text-center text-muted">Cargando libro…</div>
    }
  `,
})
export class BookDeleteComponent {
  private readonly service = inject(BooksService);
  private readonly router = inject(Router);
  private readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly book = signal<Book | null>(null);
  readonly deleting = signal(false);

  constructor() {
    this.service.get(this.id).subscribe((book) => this.book.set(book));
  }

  remove(): void {
    this.deleting.set(true);
    this.service
      .remove(this.id)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe(() => void this.router.navigate(['/admin/libros']));
  }
}
