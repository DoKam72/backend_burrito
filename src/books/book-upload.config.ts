import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const bookImageUploadOptions = {
  storage: diskStorage({
    destination: './uploads/books',
    filename: (
      _request: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(
        null,
        `${uniqueName}${extname(file.originalname).toLowerCase()}`,
      );
    },
  }),
  fileFilter: (
    _request: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('La portada debe ser JPG, PNG o WEBP'),
        false,
      );
    }

    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
