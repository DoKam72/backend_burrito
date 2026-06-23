import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',

    host: configService.get<string>('DB_HOST'),

    port: Number(
      configService.get<string>('DB_PORT')
    ),

    username:
      configService.get<string>('DB_USER'),

    password:
      configService.get<string>('DB_PASSWORD'),

    database:
      configService.get<string>('DB_NAME'),

    autoLoadEntities: true,

    synchronize:
      configService.get<string>('DB_SYNC') ===
      'true',

    ssl:
          {
            rejectUnauthorized: false,
          }
  }),
}),
    AuthModule,
    UsersModule,
    AdminModule,
    BooksModule,
    RatingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
