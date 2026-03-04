import { Test, TestingModule } from '@nestjs/testing';
import { InvestorTypeService } from './investor-type.service';

describe('InvestorTypeService', () => {
  let service: InvestorTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestorTypeService],
    }).compile();

    service = module.get<InvestorTypeService>(InvestorTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
