import { Body, Controller, Get, Param, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { RateBookDto } from './dto/rate-book.dto';
import { RatingsService } from './ratings.service';

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratings: RatingsService) {}

  @Put(':bookId')
  rate(@Req() request: AuthenticatedRequest, @Param('bookId', ParseIntPipe) bookId: number, @Body() dto: RateBookDto) {
    return this.ratings.rate(request.user.id, bookId, dto.puntuacion);
  }

  @Get('book/:bookId')
  bookRating(@Req() request: AuthenticatedRequest, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.ratings.bookRating(request.user.id, bookId);
  }

  @Get('me/affinity')
  affinity(@Req() request: AuthenticatedRequest) {
    return this.ratings.affinity(request.user.id);
  }
}
