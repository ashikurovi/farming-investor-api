import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectPeriodService } from './project-period.service';
import { ProjectPeriodEntity } from './entities/project-period.entity';

describe('ProjectPeriodService', () => {
  let service: ProjectPeriodService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    })),
    merge: jest.fn(),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectPeriodService,
        {
          provide: getRepositoryToken(ProjectPeriodEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectPeriodService>(ProjectPeriodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
