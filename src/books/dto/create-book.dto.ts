import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titulo!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  autores!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  editorial!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  genero!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(3000)
  sinopsis!: string;
}
