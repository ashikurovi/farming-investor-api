import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeEntity } from './entities/notice.entity';
export declare class NoticeService {
    private readonly noticeRepository;
    constructor(noticeRepository: Repository<NoticeEntity>);
    create(createNoticeDto: CreateNoticeDto): Promise<NoticeEntity>;
    findAll(options?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: NoticeEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pageCount: number;
        };
    }>;
    findOne(id: number): Promise<NoticeEntity>;
    update(id: number, updateNoticeDto: UpdateNoticeDto): Promise<NoticeEntity>;
    remove(id: number): Promise<void>;
}
