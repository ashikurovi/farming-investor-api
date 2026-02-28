import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerEntity } from './entities/banner.entity';
export declare class BannerService {
    private readonly bannerRepository;
    constructor(bannerRepository: Repository<BannerEntity>);
    create(createBannerDto: CreateBannerDto): Promise<BannerEntity>;
    findAll(options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: BannerEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findOne(id: number): Promise<BannerEntity>;
    update(id: number, updateBannerDto: UpdateBannerDto): Promise<BannerEntity>;
    remove(id: number): Promise<void>;
}
