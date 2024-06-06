import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SyncService } from './sync/sync.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly syncService: SyncService,
  ) {}

  async onModuleInit() {
    await this.cacheService.set(
      'mongodb-sync',
      this.syncService.getConfig(),
      0,
    );
  }
}
