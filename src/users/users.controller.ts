import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as Express from 'express';
import { BlobStorageService } from '../uploads/blob-storage.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() file: any,
    @Body() createUserDto: CreateUserDto,
  ) {
    if (file) {
      createUserDto.photoUrl =
        await this.blobStorageService.uploadUserPhoto(file);
    }

    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);

    const result = await this.usersService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.usersService.login(loginUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // Stateless JWT logout: delegate to service (no-op for now)
    await this.usersService.logout();
    return {
      statusCode: HttpStatus.OK,
      message: 'Logout successful',
    };
  }

  @Get('me')
  async me(@Req() req: Request) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Missing or invalid Authorization header',
        );
      }

      const token = authHeader.split(' ')[1];
      const payload: any = await this.jwtService.verifyAsync(token);

      const user = await this.usersService.findOne(payload.sub);

      return {
        statusCode: HttpStatus.OK,
        message: 'User profile fetched successfully',
        data: user,
      };
    } catch (error) {
      // Normalize any verification / lookup errors into 401 for the client
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new UnauthorizedException('Invalid user id');
    }

    return this.usersService.findOne(numericId).then((user) => ({
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: user,
    }));
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.usersService.forgotPassword(forgotPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset instructions sent (mock)',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.usersService.resetPassword(resetPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset successful',
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: number,
    @UploadedFile() file: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (file) {
      updateUserDto.photoUrl =
        await this.blobStorageService.uploadUserPhoto(file);
    }

    const user = await this.usersService.update(Number(id), updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Patch(':id/ban')
  async ban(@Param('id') id: number) {
    const user = await this.usersService.ban(Number(id));
    return {
      statusCode: HttpStatus.OK,
      message: 'User banned successfully',
      data: user,
    };
  }

  @Patch(':id/unban')
  async unban(@Param('id') id: number) {
    const user = await this.usersService.unban(Number(id));
    return {
      statusCode: HttpStatus.OK,
      message: 'User unbanned successfully',
      data: user,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id).then(() => ({
      statusCode: HttpStatus.OK,
      message: 'User removed successfully',
    }));
  }

  @Post(':id/withdraw-profit')
  async withdrawProfit(@Param('id') id: string) {
    const userId = Number(id);
    const data = await this.usersService.withdrawProfit(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profit withdrawn successfully',
      data,
    };
  }

  @Post(':id/withdraw-all')
  async withdrawAll(@Param('id') id: string) {
    const userId = Number(id);
    const data = await this.usersService.withdrawAll(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investment and profit withdrawn successfully',
      data,
    };
  }
  @Get(':id/investments')
  async investments(
    @Param('id') id: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const numericId = Number(id);
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 10);
    const data = await this.usersService.investmentsWithStats(numericId, {
      page: pageNumber,
      limit: limitNumber,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User investments fetched successfully',
      data,
    };
  }

  @Post(':id/payout')
  async payout(@Param('id') id: string) {
    const numericId = Number(id);
    const data = await this.usersService.payout(numericId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor payout successful',
      data,
    };
  }

  @Get(':id/payouts')
  async getPayouts(@Param('id') id: string) {
    const numericId = Number(id);
    const data = await this.usersService.getPayouts(numericId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor payouts fetched successfully',
      data,
    };
  }
}
