import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { HttpModule } from '@nestjs/axios';
import { TOKEN } from '../base';

@Module({
  imports: [
    HttpModule.register({
      headers: {
        // It isn't good idea just demonstration, in real app we need to use token from database
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    }),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
