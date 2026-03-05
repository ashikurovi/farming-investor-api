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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const data = await this.contactService.create(createContactDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Contact message received successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.contactService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Contact messages fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.contactService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contact message fetched successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const data = await this.contactService.update(+id, updateContactDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contact message updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.contactService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contact message removed successfully',
    };
  }
}
