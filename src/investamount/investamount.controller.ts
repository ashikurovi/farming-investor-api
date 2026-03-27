import { Controller, Get, Body, Patch } from '@nestjs/common';
import { InvestamountService } from './investamount.service';
import { UpdateInvestamountDto } from './dto/update-investamount.dto';

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
