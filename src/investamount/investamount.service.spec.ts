import { Test, TestingModule } from '@nestjs/testing';
import { InvestamountService } from './investamount.service';

describe('InvestamountService', () => {
  let service: InvestamountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestamountService],
    }).compile();

    service = module.get<InvestamountService>(InvestamountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
