import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const correo = process.env.ADMIN_EMAIL;
    const clave = process.env.ADMIN_PASSWORD;

    if (!correo && !clave) {
      return;
    }

    if (!correo || !clave) {
      this.logger.warn(
        'Se requieren ADMIN_EMAIL y ADMIN_PASSWORD para crear el administrador.',
      );
      return;
    }

    const existente = await this.usersService.findByEmail(correo);

    if (existente) {
      return;
    }

    await this.usersService.create({
      nombre: process.env.ADMIN_NAME ?? 'Administrador',
      correo,
      clave: await bcrypt.hash(clave, 10),
      rol: UserRole.Admin,
    });

    this.logger.log(`Administrador creado: ${correo}`);
  }
}
