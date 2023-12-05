import { Module } from '@nestjs/common';
import { CleanPromiseService } from './clean-promise.service';

@Module({
  providers: [CleanPromiseService],
  exports: [CleanPromiseService],
})
export class CleanPromiseModule {}
