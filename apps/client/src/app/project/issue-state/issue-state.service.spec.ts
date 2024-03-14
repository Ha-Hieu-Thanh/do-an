import { Test, TestingModule } from '@nestjs/testing';
import { IssueStateService } from './issue-state.service';

describe('IssueStateService', () => {
  let service: IssueStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueStateService],
    }).compile();

    service = module.get<IssueStateService>(IssueStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
