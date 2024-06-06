import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AppService } from './app.service';
import { SyncService } from './sync/sync.service';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [
    SyncModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    }),
  ],
  controllers: [],
  providers: [AppService, SyncService],
})
export class AppModule {}
