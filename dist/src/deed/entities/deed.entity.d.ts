import { Investment } from '../../investment/entities/investment.entity';
export declare class Deed {
    id: number;
    investmentId: number;
    investment: Investment;
    title: string;
    file: string;
    uploadPdf: string;
    issueDate: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
}
