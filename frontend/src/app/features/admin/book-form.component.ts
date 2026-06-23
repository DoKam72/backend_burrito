import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BooksService } from '../../core/services/books.service';

@Component({
  selector: 'admin-book-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="mb-4">
      <h4 class="fw-bold mb-1">{{ editing ? 'Editar libro' : 'Agregar libro' }}</h4>
      <p class="text-muted mb-0">
        {{ editing ? 'Actualiza la información del título.' : 'Añade una nueva historia a la colección.' }}
      </p>
    </div>

    <form class="card form-card" [formGroup]="form" (ngSubmit)="submit()">
      <div class="card-body">
        <div class="row g-4">
          <div class="col-md-6">
            <label class="form-label" for="titulo">Título</label>
            <input id="titulo" class="form-control" formControlName="titulo" placeholder="Ej. Cien años de soledad" />
          </div>

          <div class="col-md-6">
            <label class="form-label" for="autores">Autor o autores</label>
            <input id="autores" class="form-control" formControlName="autores" placeholder="Ej. Gabriel García Márquez" />
          </div>

          <div class="col-md-6">
            <label class="form-label" for="editorial">Editorial</label>
            <input id="editorial" class="form-control" formControlName="editorial" placeholder="Ej. Diana" />
          </div>

          <div class="col-md-6">
            <label class="form-label" for="genero">Género</label>
            <input id="genero" class="form-control" formControlName="genero" placeholder="Ej. Realismo mágico" />
          </div>

          <div class="col-lg-7">
            <label class="form-label" for="sinopsis">Sinopsis</label>
            <textarea
              id="sinopsis"
              class="form-control"
              formControlName="sinopsis"
              rows="9"
              placeholder="Describe brevemente el libro..."
            ></textarea>
          </div>

          <div class="col-lg-5">
            <label class="form-label" for="imagen">Portada</label>
            <div class="upload-box h-100">
              <div class="d-flex align-items-start gap-3">
                @if (preview()) {
                  <img class="upload-preview" [src]="preview()!" alt="Vista previa" />
                } @else {
                  <div class="upload-preview d-grid place-items-center text-primary">
                    <i class="bx bx-image-add fs-1"></i>
                  </div>
                }

                <div class="flex-grow-1">
                  <strong class="d-block mb-1">{{ fileName() || 'Selecciona una imagen' }}</strong>
                  <small class="text-muted d-block mb-3">JPG, PNG o WEBP · máximo 5 MB</small>
                  <input
                    id="imagen"
                    class="form-control"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    (change)="onFile($event)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        @if (error()) {
          <div class="alert alert-danger mt-4" role="alert">{{ error() }}</div>
        }

        <div class="d-flex justify-content-end gap-2 mt-4">
          <a class="btn btn-label-secondary" routerLink="/admin/libros">Cancelar</a>
          <button class="btn btn-primary" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Guardando…' : editing ? 'Guardar cambios' : 'Agregar libro' }}
          </button>
        </div>
      </div>
    </form>
  `,
})
export class BookFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BooksService);
  private readonly router = inject(Router);
  private readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly editing = !!this.id;
  readonly saving = signal(false);
  readonly error = signal('');
  readonly preview = signal<string | null>(null);
  readonly fileName = signal('');
  private file?: File;
  readonly form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    autores: ['', Validators.required],
    editorial: ['', Validators.required],
    genero: ['', Validators.required],
    sinopsis: ['', [Validators.required, Validators.maxLength(3000)]],
  });

  constructor() {
    if (this.editing) {
      this.service.get(this.id).subscribe((book) => {
        this.form.patchValue(book);
        this.preview.set(this.service.imageUrl(book.imagen));
      });
    }
  }

  onFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.file = file;
    this.fileName.set(file.name);
    const reader = new FileReader();
    reader.onload = () => this.preview.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) return;
    const data = new FormData();
    Object.entries(this.form.getRawValue()).forEach(([key, value]) => data.append(key, value));
    if (this.file) data.append('imagen', this.file);
    this.saving.set(true);
    const request = this.editing ? this.service.update(this.id, data) : this.service.create(data);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => void this.router.navigate(['/admin/libros']),
      error: (error) => this.error.set(error.error?.message ?? 'No fue posible guardar el libro.'),
    });
  }
}
