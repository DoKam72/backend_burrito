import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existe = await this.usersService.findByEmail(dto.correo);

    if (existe) {
      throw new BadRequestException('Correo ya registrado');
    }

    const hash = await bcrypt.hash(dto.clave, 10);

    const user = await this.usersService.create({
      ...dto,
      clave: hash,
    });

    return {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    };
  }

  async login(correo: string, clave: string) {
    const user = await this.usersService.findByEmailWithPassword(correo);

    if (!user || !(await bcrypt.compare(clave, user.clave))) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      correo: user.correo,
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }
}
