import { HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/contact.entity").ContactMessage;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/contact.entity").ContactMessage[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/contact.entity").ContactMessage;
    }>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/contact.entity").ContactMessage;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
