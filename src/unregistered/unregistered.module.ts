import { Module } from '@nestjs/common';
import { UnregisteredService } from './unregistered.service';
import { UnregisteredController } from './unregistered.controller';

@Module({
  controllers: [UnregisteredController],
  providers: [UnregisteredService],
})
export class UnregisteredModule {}
