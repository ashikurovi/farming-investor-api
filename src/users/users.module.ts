import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { InvestorTypeEntity } from '../investor-type/entities/investor-type.entity';
import { Investment } from '../investment/entities/investment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, InvestorTypeEntity, Investment]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
