import { Test, TestingModule } from '@nestjs/testing';
import { ProjectPeriodController } from './project-period.controller';
import { ProjectPeriodService } from './project-period.service';

describe('ProjectPeriodController', () => {
  let controller: ProjectPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectPeriodController],
      providers: [ProjectPeriodService],
    }).compile();

    controller = module.get<ProjectPeriodController>(ProjectPeriodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
