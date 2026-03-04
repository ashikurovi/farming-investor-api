import { HttpStatus } from '@nestjs/common';
import { InvestorTypeService } from './investor-type.service';
import { CreateInvestorTypeDto } from './dto/create-investor-type.dto';
import { UpdateInvestorTypeDto } from './dto/update-investor-type.dto';
export declare class InvestorTypeController {
    private readonly investorTypeService;
    constructor(investorTypeService: InvestorTypeService);
    create(createInvestorTypeDto: CreateInvestorTypeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./investor-type.service").InvestorTypeResponse;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./investor-type.service").InvestorTypeResponse[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./investor-type.service").InvestorTypeResponse;
    }>;
    update(id: string, updateInvestorTypeDto: UpdateInvestorTypeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./investor-type.service").InvestorTypeResponse;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
