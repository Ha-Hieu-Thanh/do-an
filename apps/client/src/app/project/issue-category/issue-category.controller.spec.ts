import { Test, TestingModule } from '@nestjs/testing';
import { IssueCategoryController } from './issue-category.controller';
import { IssueCategoryService } from './issue-category.service';

describe('IssueCategoryController', () => {
  let controller: IssueCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueCategoryController],
      providers: [IssueCategoryService],
    }).compile();

    controller = module.get<IssueCategoryController>(IssueCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
