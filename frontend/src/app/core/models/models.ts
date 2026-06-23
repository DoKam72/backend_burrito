export type UserRole = 'usuario' | 'admin';
export interface User { id: number; nombre: string; correo: string; rol: UserRole; }
export interface LoginRequest { correo: string; clave: string; }
export interface RegisterRequest extends LoginRequest { nombre: string; }
export interface AuthResponse { access_token: string; user: User; }
export interface Book { id: number; titulo: string; autores: string; editorial: string; genero: string; sinopsis: string; imagen: string | null; creadoEn: string; actualizadoEn: string; }
export interface DashboardStats { lectores: number; libros: number; promedioRating: number; }
export interface BookRating { miPuntuacion: number | null; promedio: number; total: number; }
export interface AffinityItem { libroId: number; titulo: string; lector: string; suPuntuacion: number; miPuntuacion: number; diferencia: number; }
