import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configuredOrigins = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set([
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    ...configuredOrigins,
  ]);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });
  app.enableCors({
    origin: (origin, callback) => {
      const isVercelPreview = !!origin && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
      if (!origin || allowedOrigins.has(origin) || isVercelPreview) {
        callback(null, true);
        return;
      }
      callback(new Error('Origen no permitido por CORS'), false);
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
