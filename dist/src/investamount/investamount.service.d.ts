import { Repository } from 'typeorm';
import { Investamount } from './entities/investamount.entity';
import { UpdateInvestamountDto } from './dto/update-investamount.dto';
export declare class InvestamountService {
    private readonly repo;
    constructor(repo: Repository<Investamount>);
    findFirst(): Promise<Investamount>;
    update(updateInvestamountDto: UpdateInvestamountDto): Promise<Investamount>;
}
