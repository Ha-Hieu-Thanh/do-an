import { Test, TestingModule } from '@nestjs/testing';
import { GlobalCacheService } from './cache.service';

describe('CacheService', () => {
  let service: GlobalCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalCacheService],
    }).compile();

    service = module.get<GlobalCacheService>(GlobalCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
