import { Test, TestingModule } from '@nestjs/testing';
import { CleanPromiseService } from './clean-promise.service';

describe('CleanPromiseService', () => {
  let service: CleanPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanPromiseService],
    }).compile();

    service = module.get<CleanPromiseService>(CleanPromiseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
