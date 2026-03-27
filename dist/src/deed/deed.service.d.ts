import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { Repository } from 'typeorm';
import { Deed } from './entities/deed.entity';
export declare class DeedService {
    private readonly deedRepository;
    constructor(deedRepository: Repository<Deed>);
    create(createDeedDto: CreateDeedDto): Promise<Deed>;
    findAll({ page, limit, search }: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: Deed[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findOne(id: number): Promise<Deed>;
    update(id: number, updateDeedDto: UpdateDeedDto): Promise<Deed>;
    remove(id: number): Promise<Deed>;
}
