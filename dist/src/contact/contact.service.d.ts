import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactService {
    private readonly contactRepository;
    constructor(contactRepository: Repository<ContactMessage>);
    create(createContactDto: CreateContactDto): Promise<ContactMessage>;
    findAll(): Promise<ContactMessage[]>;
    findOne(id: number): Promise<ContactMessage>;
    update(id: number, updateContactDto: UpdateContactDto): Promise<ContactMessage>;
    remove(id: number): Promise<void>;
}
