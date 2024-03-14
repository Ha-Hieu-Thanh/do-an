import { Test, TestingModule } from '@nestjs/testing';
import { IssueTypeController } from './issue-type.controller';
import { IssueTypeService } from './issue-type.service';

describe('IssueTypeController', () => {
  let controller: IssueTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueTypeController],
      providers: [IssueTypeService],
    }).compile();

    controller = module.get<IssueTypeController>(IssueTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
