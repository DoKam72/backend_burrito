import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="authentication-wrapper authentication-cover">
      <div class="authentication-inner row m-0">
        <div class="d-none d-lg-flex col-lg-7 col-xl-8 align-items-center auth-cover">
          <div class="w-100 d-flex flex-column align-items-center justify-content-center px-5">
            <img
              class="auth-illustration mb-4"
              src="assets/img/illustrations/man-with-laptop-light.png"
              alt="Lector con laptop"
            />
            <h2 class="text-primary text-center mb-2">Burrito Lector</h2>
            <p class="text-center text-muted w-75">
              Lee, descubre y comparte tus libros favoritos con otros lectores.
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

            <h4 class="mb-2">Bienvenido de nuevo 👋</h4>
            <p class="mb-4">Ingresa con tu correo y contraseña para continuar.</p>

            <form class="mb-3" [formGroup]="form" (ngSubmit)="submit()">
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

              <div class="mb-3 form-password-toggle">
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
                {{ loading() ? 'Ingresando…' : 'Ingresar' }}
              </button>
            </form>

            <p class="text-center">
              <span>¿Aún no tienes cuenta?</span>
              <a routerLink="/registro"><span> Crear cuenta</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => void this.router.navigate([response.user.rol === 'admin' ? '/admin/dashboard' : '/galeria']),
        error: (error) => this.error.set(error.error?.message ?? 'No fue posible iniciar sesión.'),
      });
  }
}
