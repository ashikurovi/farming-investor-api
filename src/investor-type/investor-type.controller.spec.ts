import { Test, TestingModule } from '@nestjs/testing';
import { InvestorTypeController } from './investor-type.controller';
import { InvestorTypeService } from './investor-type.service';

describe('InvestorTypeController', () => {
  let controller: InvestorTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorTypeController],
      providers: [InvestorTypeService],
    }).compile();

    controller = module.get<InvestorTypeController>(InvestorTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
