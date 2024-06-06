import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}
