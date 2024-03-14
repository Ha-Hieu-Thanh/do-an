import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthenticationService } from './jwt-authentication.service';

describe('JwtAuthenticationService', () => {
  let service: JwtAuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthenticationService],
    }).compile();

    service = module.get<JwtAuthenticationService>(JwtAuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
