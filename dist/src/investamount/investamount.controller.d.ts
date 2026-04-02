import { InvestamountService } from './investamount.service';
import { UpdateInvestamountDto } from './dto/update-investamount.dto';
export declare class InvestamountController {
    private readonly investamountService;
    constructor(investamountService: InvestamountService);
    findFirst(): Promise<import("./entities/investamount.entity").Investamount>;
    update(updateInvestamountDto: UpdateInvestamountDto): Promise<import("./entities/investamount.entity").Investamount>;
}
