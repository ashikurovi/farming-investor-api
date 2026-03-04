import { Repository } from 'typeorm';
import { GlarryEntity } from './entities/glarry.entity';
import { CreateGlarryDto } from './dto/create-glarry.dto';
import { UpdateGlarryDto } from './dto/update-glarry.dto';
export type GlarryResponse = {
    id: number;
    photoUrl: string;
};
export declare class GlarryService {
    private readonly glarryRepo;
    constructor(glarryRepo: Repository<GlarryEntity>);
    create(createGlarryDto: CreateGlarryDto): Promise<GlarryResponse>;
    findAll(options?: {
        page?: number;
        limit?: number;
        projectId?: number;
    }): Promise<{
        items: GlarryResponse[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findByProject(projectId: number, options?: {
        page?: number;
        limit?: number;
    }): Promise<{
        items: GlarryResponse[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findOne(id: number): Promise<GlarryResponse>;
    update(id: number, updateGlarryDto: UpdateGlarryDto): Promise<GlarryResponse>;
    remove(id: number): Promise<void>;
    private toResponse;
}
