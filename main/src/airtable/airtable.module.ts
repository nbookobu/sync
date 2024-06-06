import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TOKEN } from '../base';
import { AirtableService } from './airtable.service';
import { AirtableController } from './airtable.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule.register({
      headers: {
        // It isn't good idea just demonstration, in real app we need to use token from database
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    }),
    ClientsModule.register([
      {
        name: 'SYNC_SERVICE_REDIS',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
          password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
        },
      },
    ]),
  ],
  providers: [AirtableService],
  controllers: [AirtableController],
})
export class AirtableModule {}
