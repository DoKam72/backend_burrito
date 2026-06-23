import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['usuario', 'libro'])
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  usuario!: User;

  @ManyToOne(() => Book, { eager: true, onDelete: 'CASCADE' })
  libro!: Book;

  @Column({ type: 'int' })
  puntuacion!: number;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
