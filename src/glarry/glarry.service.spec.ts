import { Test, TestingModule } from '@nestjs/testing';
import { GlarryService } from './glarry.service';

describe('GlarryService', () => {
  let service: GlarryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlarryService],
    }).compile();

    service = module.get<GlarryService>(GlarryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
