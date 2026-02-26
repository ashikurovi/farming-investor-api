import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // 1️⃣ Load .env first
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2️⃣ Use async config (recommended)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: true, // ❗ only dev
        logging: true, // ❗ only dev
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    UsersModule,
    UploadsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}