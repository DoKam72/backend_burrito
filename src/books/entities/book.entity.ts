import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  autores!: string;

  @Column()
  editorial!: string;

  @Column()
  genero!: string;

  @Column({ type: 'text' })
  sinopsis!: string;

  @Column({ type: 'varchar', nullable: true })
  imagen!: string | null;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
