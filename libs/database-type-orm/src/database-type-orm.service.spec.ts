import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTypeOrmService } from './database-type-orm.service';

describe('DatabaseTypeOrmService', () => {
  let service: DatabaseTypeOrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseTypeOrmService],
    }).compile();

    service = module.get<DatabaseTypeOrmService>(DatabaseTypeOrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
