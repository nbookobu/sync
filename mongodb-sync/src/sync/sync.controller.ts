import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @MessagePattern('mongo-sync')
  handleNewChanges(data: any) {
    console.log('Received message:', data);
    // do something here
  }

  @Get('/:integrationId/auth/')
  getHeaders(@Param('integrationId') integrationId) {
    return this.syncService.getAuth(integrationId);
  }

  @Get('/:integrationId/groups')
  getGroups(@Param('groupId') integrationId) {
    return this.syncService.getGroups(integrationId);
  }

  @Get('/:integrationId/groups/:groupId')
  getFields(@Param('integrationId') integrationId, @Param('groupId') groupId) {
    return this.syncService.getFields(integrationId, groupId);
  }
}
