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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() createUserDto: CreateUserDto,
  ) {
    if (file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      createUserDto.photoUrl = `${baseUrl}/uploads/${file.filename}`;
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

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(Number(id)).then((user) => ({
      statusCode: HttpStatus.OK,
        message: 'User fetched successfully',
        data: user,
      }),
    );
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

  @Get('me')
  async me(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.findOne(payload.sub);

    return {
      statusCode: HttpStatus.OK,
      message: 'User profile fetched successfully',
      data: user,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: number,
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updateUserDto.photoUrl = `${baseUrl}/uploads/${file.filename}`;
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
}
