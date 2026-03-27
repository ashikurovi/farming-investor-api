import { Test, TestingModule } from '@nestjs/testing';
import { InvestamountController } from './investamount.controller';
import { InvestamountService } from './investamount.service';

describe('InvestamountController', () => {
  let controller: InvestamountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestamountController],
      providers: [InvestamountService],
    }).compile();

    controller = module.get<InvestamountController>(InvestamountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
