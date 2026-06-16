import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ order: { titulo: 'ASC' } });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }

    return book;
  }

  create(dto: CreateBookDto, file?: Express.Multer.File): Promise<Book> {
    const book = this.booksRepository.create({
      ...dto,
      imagen: file ? `/uploads/books/${file.filename}` : null,
    });

    return this.booksRepository.save(book);
  }

  async update(
    id: number,
    dto: UpdateBookDto,
    file?: Express.Multer.File,
  ): Promise<Book> {
    const book = await this.findOne(id);
    const previousImage = book.imagen;

    Object.assign(book, dto);

    if (file) {
      book.imagen = `/uploads/books/${file.filename}`;
    }

    const updatedBook = await this.booksRepository.save(book);

    if (file && previousImage) {
      await this.deleteImage(previousImage);
    }

    return updatedBook;
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);

    if (book.imagen) {
      await this.deleteImage(book.imagen);
    }
  }

  count(): Promise<number> {
    return this.booksRepository.count();
  }

  private async deleteImage(imagePath: string): Promise<void> {
    const relativePath = imagePath.replace(/^\/uploads\//, '');

    try {
      await unlink(join(process.cwd(), 'uploads', relativePath));
    } catch {
      // The database operation should succeed even if the old file is absent.
    }
  }
}
