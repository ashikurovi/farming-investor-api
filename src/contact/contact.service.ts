import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ContactMessage> {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ContactMessage> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact message with id "${id}" not found`);
    }
    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<ContactMessage> {
    const contact = await this.findOne(id);
    const merged = this.contactRepository.merge(contact, updateContactDto);
    return this.contactRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact message with id "${id}" not found`);
    }
  }
}
