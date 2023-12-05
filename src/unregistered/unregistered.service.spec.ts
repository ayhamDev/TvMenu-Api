import { Test, TestingModule } from '@nestjs/testing';
import { UnregisteredService } from './unregistered.service';

describe('UnregisteredService', () => {
  let service: UnregisteredService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnregisteredService],
    }).compile();

    service = module.get<UnregisteredService>(UnregisteredService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
