import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Get('/:serviceId/groups')
  @HttpCode(HttpStatus.OK)
  async groups(@Param('serviceId') serviceId) {
    const { data } = await this.serviceService.getGroups(serviceId);
    return data;
  }

  @Get('/:serviceId/groups/:groupId')
  @HttpCode(HttpStatus.OK)
  async fields(@Param('serviceId') serviceId, @Param('groupId') groupId) {
    const { data } = await this.serviceService.getFields(serviceId, groupId);
    return data;
  }
}
