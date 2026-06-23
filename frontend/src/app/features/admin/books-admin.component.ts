import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../core/models/models';
import { BooksService } from '../../core/services/books.service';

@Component({
  selector: 'admin-books',
  imports: [RouterLink],
  template: `
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h4 class="fw-bold mb-1">Libros</h4>
        <p class="text-muted mb-0">Administra los títulos disponibles.</p>
      </div>
      <a class="btn btn-primary" routerLink="/admin/libros/agregar">
        <i class="bx bx-plus me-1"></i>
        Agregar libro
      </a>
    </div>

    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>Libro</th>
              <th>Autor</th>
              <th>Género</th>
              <th>Editorial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            @for (book of books(); track book.id) {
              <tr>
                <td>
                  <div class="d-flex align-items-center gap-3">
                    @if (service.imageUrl(book.imagen); as cover) {
                      <img class="rounded" width="42" height="58" style="object-fit: cover" [src]="cover" [alt]="book.titulo" />
                    } @else {
                      <span class="avatar-initial rounded bg-label-primary p-2"><i class="bx bx-book"></i></span>
                    }
                    <strong>{{ book.titulo }}</strong>
                  </div>
                </td>
                <td>{{ book.autores }}</td>
                <td><span class="badge bg-label-primary">{{ book.genero }}</span></td>
                <td>{{ book.editorial }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <a class="btn btn-sm btn-outline-primary" [routerLink]="['/admin/libros/editar', book.id]">
                      <i class="bx bx-edit-alt"></i>
                    </a>
                    <a class="btn btn-sm btn-outline-danger" [routerLink]="['/admin/libros/eliminar', book.id]">
                      <i class="bx bx-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="text-center text-muted py-5">No hay libros registrados.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class BooksAdminComponent {
  readonly service = inject(BooksService);
  readonly books = signal<Book[]>([]);

  constructor() {
    this.service.list().subscribe((books) => this.books.set(books));
  }
}
