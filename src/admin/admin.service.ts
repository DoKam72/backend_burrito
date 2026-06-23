import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { BooksService } from '../books/books.service';
import { RatingsService } from '../ratings/ratings.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly booksService: BooksService,
    private readonly ratingsService: RatingsService,
  ) {}

  async dashboard() {
    return {
      lectores: await this.usersService.countByRole(UserRole.Reader),
      libros: await this.booksService.count(),
      promedioRating: await this.ratingsService.globalAverage(),
    };
  }
}
