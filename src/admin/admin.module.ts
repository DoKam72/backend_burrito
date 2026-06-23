import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminSeedService } from './admin-seed.service';
import { AdminService } from './admin.service';
import { BooksModule } from '../books/books.module';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [AuthModule, UsersModule, BooksModule, RatingsModule],
  controllers: [AdminController],
  providers: [AdminService, AdminSeedService],
})
export class AdminModule {}
