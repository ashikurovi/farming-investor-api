import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerInvestDto } from './dto/partner-invest.dto';
import { DistributeCommissionDto } from './dto/distribute-commission.dto';
import { WithdrawProfitDto } from './dto/withdraw-profit.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.partnerService.findAll();
  }

  @Get('payouts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllPayouts() {
    return this.partnerService.getAllPayouts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.partnerService.findOne(+id);
  }

  @Post(':id/invest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  invest(@Param('id') id: string, @Body() dto: PartnerInvestDto) {
    return this.partnerService.invest(+id, dto);
  }

  @Post('commission/distribute')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  distributeCommission(@Body() dto: DistributeCommissionDto) {
    return this.partnerService.distributeCommission(dto);
  }

  @Post(':id/withdraw-profit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  withdrawProfit(@Param('id') id: string, @Body() dto: WithdrawProfitDto) {
    return this.partnerService.withdrawProfit(+id, dto);
  }

  @Get(':id/payouts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  getPayouts(@Param('id') id: string) {
    return this.partnerService.getPayouts(+id);
  }
}
