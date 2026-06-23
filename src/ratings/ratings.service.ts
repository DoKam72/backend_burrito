import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private readonly ratings: Repository<Rating>,
    private readonly books: BooksService,
    private readonly users: UsersService,
  ) {}

  async rate(userId: number, bookId: number, puntuacion: number): Promise<Rating> {
    const [usuario, libro] = await Promise.all([this.users.findById(userId), this.books.findOne(bookId)]);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    let rating = await this.ratings.findOne({ where: { usuario: { id: userId }, libro: { id: bookId } } });
    rating = rating ? Object.assign(rating, { puntuacion }) : this.ratings.create({ usuario, libro, puntuacion });
    return this.ratings.save(rating);
  }

  async bookRating(userId: number, bookId: number) {
    const own = await this.ratings.findOne({ where: { usuario: { id: userId }, libro: { id: bookId } } });
    const summary = await this.ratings.createQueryBuilder('rating')
      .select('AVG(rating.puntuacion)', 'promedio').addSelect('COUNT(rating.id)', 'total')
      .where('rating.libroId = :bookId', { bookId }).getRawOne<{ promedio: string | null; total: string }>();
    return { miPuntuacion: own?.puntuacion ?? null, promedio: Number(summary?.promedio ?? 0), total: Number(summary?.total ?? 0) };
  }

  async affinity(userId: number) {
    const mine = await this.ratings.find({ where: { usuario: { id: userId } } });
    if (!mine.length) return [];
    const mineByBook = new Map(mine.map((rating) => [rating.libro.id, rating.puntuacion]));
    const others = await this.ratings.find({ where: { usuario: { id: Not(userId) } } });
    return others
      .filter((rating) => mineByBook.has(rating.libro.id))
      .map((rating) => ({
        libroId: rating.libro.id,
        titulo: rating.libro.titulo,
        lector: rating.usuario.nombre,
        suPuntuacion: rating.puntuacion,
        miPuntuacion: mineByBook.get(rating.libro.id)!,
        diferencia: Math.abs(rating.puntuacion - mineByBook.get(rating.libro.id)!),
      }))
      .filter((item) => item.diferencia <= 1)
      .sort((a, b) => a.diferencia - b.diferencia || a.titulo.localeCompare(b.titulo));
  }

  async globalAverage(): Promise<number> {
    const result = await this.ratings.createQueryBuilder('rating').select('AVG(rating.puntuacion)', 'average').getRawOne<{ average: string | null }>();
    return Number(result?.average ?? 0);
  }
}
