import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AirtableModule } from './airtable/airtable.module';
import { AirtableService } from './airtable/airtable.service';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    AirtableModule,
    HttpModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    }),
    ServiceModule,
  ],
  controllers: [],
  providers: [AirtableService],
})
export class AppModule {}
