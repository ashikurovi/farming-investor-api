import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { InvestamountService } from './investamount.service';
import { UpdateInvestamountDto } from './dto/update-investamount.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('investamount')
export class InvestamountController {
  constructor(private readonly investamountService: InvestamountService) {}

  @Get()
  findFirst() {
    return this.investamountService.findFirst();
  }

  @Patch()
  update(@Body() updateInvestamountDto: UpdateInvestamountDto) {
    return this.investamountService.update(updateInvestamountDto);
  }
}
