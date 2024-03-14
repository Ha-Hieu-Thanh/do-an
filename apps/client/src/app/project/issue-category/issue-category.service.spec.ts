import { Test, TestingModule } from '@nestjs/testing';
import { IssueCategoryService } from './issue-category.service';

describe('IssueCategoryService', () => {
  let service: IssueCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueCategoryService],
    }).compile();

    service = module.get<IssueCategoryService>(IssueCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
