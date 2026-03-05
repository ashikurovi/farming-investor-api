import { Test, TestingModule } from '@nestjs/testing';
import { DailyReportController } from './daily-report.controller';
import { DailyReportService } from './daily-report.service';

describe('DailyReportController', () => {
  let controller: DailyReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyReportController],
      providers: [DailyReportService],
    }).compile();

    controller = module.get<DailyReportController>(DailyReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
