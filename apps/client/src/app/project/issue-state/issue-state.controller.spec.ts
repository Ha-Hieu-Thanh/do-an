import { Test, TestingModule } from '@nestjs/testing';
import { IssueStateController } from './issue-state.controller';
import { IssueStateService } from './issue-state.service';

describe('IssueStateController', () => {
  let controller: IssueStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueStateController],
      providers: [IssueStateService],
    }).compile();

    controller = module.get<IssueStateController>(IssueStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
