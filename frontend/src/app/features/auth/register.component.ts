import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="authentication-wrapper authentication-cover">
      <div class="authentication-inner row m-0">
        <div class="d-none d-lg-flex col-lg-7 col-xl-8 align-items-center auth-cover">
          <div class="w-100 d-flex flex-column align-items-center justify-content-center px-5">
            <img
              class="auth-illustration mb-4"
              src="assets/img/illustrations/girl-doing-yoga-light.png"
              alt="Ilustración de bienvenida"
            />
            <h2 class="text-primary text-center mb-2">Crea tu rincón lector</h2>
            <p class="text-center text-muted w-75">
              Guarda tus libros, puntúa tus lecturas y encuentra personas con gustos parecidos.
            </p>
          </div>
        </div>

        <div class="d-flex col-12 col-lg-5 col-xl-4 align-items-center authentication-bg p-sm-5 p-4">
          <div class="w-px-400 mx-auto">
            <div class="app-brand justify-content-center mb-4">
              <a class="app-brand-link gap-2" routerLink="/login">
                <span class="app-brand-logo">B</span>
                <span class="app-brand-text demo text-body fw-bolder">Burrito Lector</span>
              </a>
            </div>

            <h4 class="mb-2">Crear cuenta</h4>
            <p class="mb-4">Solo necesitamos tus datos básicos para empezar.</p>

            <form class="mb-3" [formGroup]="form" (ngSubmit)="submit()">
              <div class="mb-3">
                <label class="form-label" for="nombre">Nombre</label>
                <input id="nombre" class="form-control" formControlName="nombre" placeholder="Tu nombre" />
              </div>

              <div class="mb-3">
                <label class="form-label" for="correo">Correo electrónico</label>
                <input
                  id="correo"
                  class="form-control"
                  type="email"
                  formControlName="correo"
                  placeholder="lector@correo.com"
                />
              </div>

              <div class="mb-3">
                <label class="form-label" for="clave">Contraseña</label>
                <input
                  id="clave"
                  class="form-control"
                  type="password"
                  formControlName="clave"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              @if (error()) {
                <div class="alert alert-danger" role="alert">{{ error() }}</div>
              }

              <button class="btn btn-primary d-grid w-100" [disabled]="form.invalid || loading()">
                {{ loading() ? 'Creando…' : 'Crear cuenta' }}
              </button>
            </form>

            <p class="text-center">
              <span>¿Ya tienes cuenta?</span>
              <a routerLink="/login"><span> Inicia sesión</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.auth
      .register(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/login']),
        error: (error) => this.error.set(error.error?.message ?? 'No fue posible crear la cuenta.'),
      });
  }
}
