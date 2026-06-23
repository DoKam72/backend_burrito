import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../core/models/models';
import { BooksService } from '../core/services/books.service';

@Component({
  selector: 'book-card',
  imports: [RouterLink],
  template: `
    <a class="card book-card h-100" [routerLink]="['/galeria', book().id]">
      @if (books.imageUrl(book().imagen); as cover) {
        <img class="card-img-top book-cover" [src]="cover" [alt]="'Portada de ' + book().titulo" />
      } @else {
        <div class="cover-placeholder">
          <i class="bx bx-book-open"></i>
        </div>
      }

      <div class="card-body">
        <span class="badge bg-label-primary mb-2">{{ book().genero }}</span>
        <h5 class="card-title mb-1">{{ book().titulo }}</h5>
        <small class="text-muted d-block mb-3">{{ book().autores }}</small>
        <p class="card-text text-muted">{{ book().sinopsis }}</p>
        <span class="text-primary fw-semibold">
          Ver reseña <i class="bx bx-right-arrow-alt align-middle"></i>
        </span>
      </div>
    </a>
  `,
})
export class BookCardComponent {
  readonly book = input.required<Book>();

  constructor(readonly books: BooksService) {}
}
