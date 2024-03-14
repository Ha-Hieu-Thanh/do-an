import { Test, TestingModule } from '@nestjs/testing';
import { IssueTypeService } from './issue-type.service';

describe('IssueTypeService', () => {
  let service: IssueTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueTypeService],
    }).compile();

    service = module.get<IssueTypeService>(IssueTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
