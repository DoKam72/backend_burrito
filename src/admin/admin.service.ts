import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { BooksService } from '../books/books.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  async dashboard() {
    return {
      lectores: await this.usersService.countByRole(UserRole.Reader),
      libros: await this.booksService.count(),
      promedioRating: 0,
    };
  }
}
