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
} from '@nestjs/common';
import { InvestorTypeService } from './investor-type.service';
import { CreateInvestorTypeDto } from './dto/create-investor-type.dto';
import { UpdateInvestorTypeDto } from './dto/update-investor-type.dto';

@Controller('investor-types')
export class InvestorTypeController {
  constructor(private readonly investorTypeService: InvestorTypeService) {}

  @Post()
  async create(@Body() createInvestorTypeDto: CreateInvestorTypeDto) {
    const data = await this.investorTypeService.create(createInvestorTypeDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Investor type created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.investorTypeService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor types fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.investorTypeService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor type fetched successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvestorTypeDto: UpdateInvestorTypeDto,
  ) {
    const data = await this.investorTypeService.update(+id, updateInvestorTypeDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor type updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.investorTypeService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor type removed successfully',
    };
  }
}
