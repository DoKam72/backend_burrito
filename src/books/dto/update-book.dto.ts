import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  autores?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  editorial?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  genero?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  sinopsis?: string;
}
