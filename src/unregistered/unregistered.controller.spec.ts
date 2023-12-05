import { Test, TestingModule } from '@nestjs/testing';
import { UnregisteredController } from './unregistered.controller';
import { UnregisteredService } from './unregistered.service';

describe('UnregisteredController', () => {
  let controller: UnregisteredController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnregisteredController],
      providers: [UnregisteredService],
    }).compile();

    controller = module.get<UnregisteredController>(UnregisteredController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
