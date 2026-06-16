import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';

type CreateUserData = Pick<User, 'nombre' | 'correo' | 'clave'> &
  Partial<Pick<User, 'rol'>>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(correo: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ correo });
  }

  findByEmailWithPassword(correo: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.clave')
      .where('user.correo = :correo', { correo })
      .getOne();
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(userData: CreateUserData): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  countByRole(rol: UserRole): Promise<number> {
    return this.usersRepository.countBy({ rol });
  }
}
