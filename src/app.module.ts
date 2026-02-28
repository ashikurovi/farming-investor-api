import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';
import { BannerModule } from './banner/banner.module';
import { ProjectPeriodModule } from './project-period/project-period.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { InvestmentsModule } from './investments/investments.module';

@Module({
  imports: [
    // 1️⃣ Load .env first
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2️⃣ Use async config (recommended)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
 
        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: true, // only dev; use migrations in prod
          logging: true, // disable in prod for speed
          ssl: {
            rejectUnauthorized: false,
          },
         
        };
      },
    }),

    AuthModule,
    UsersModule,
    UploadsModule,
    BannerModule,
    ProjectPeriodModule,
    ProjectsModule,
    InvestmentsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}