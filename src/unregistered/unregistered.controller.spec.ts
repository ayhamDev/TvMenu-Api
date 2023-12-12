import { Test, TestingModule } from '@nestjs/testing';
import { UnregisteredController } from './unregistered.controller';

describe('UnregisteredController', () => {
  let controller: UnregisteredController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnregisteredController],
    }).compile();

    controller = module.get<UnregisteredController>(UnregisteredController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
