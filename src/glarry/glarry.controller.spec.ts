import { Test, TestingModule } from '@nestjs/testing';
import { GlarryController } from './glarry.controller';
import { GlarryService } from './glarry.service';

describe('GlarryController', () => {
  let controller: GlarryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlarryController],
      providers: [GlarryService],
    }).compile();

    controller = module.get<GlarryController>(GlarryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
