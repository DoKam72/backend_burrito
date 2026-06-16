import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtPayload {
  sub: number;
  correo: string;
  rol: UserRole;
}
