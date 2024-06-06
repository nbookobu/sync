import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  HttpCode,
  Inject,
  Query,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AirtableService } from './airtable.service';
import { BaseDto } from './dtos/base.dto';
import { DeleteHookDto } from './dtos/delete-hook.dto';
import { HookDto } from './dtos/hook.dto';
import { IntegrationAnotherMongo, IntegrationMongodb } from '../base';

@Controller('airtable')
export class AirtableController {
  constructor(
    private airtableService: AirtableService,
    @Inject('SYNC_SERVICE_REDIS') private client: ClientProxy,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createHook(@Body() body: BaseDto) {
    // hardcoded now 'appdXoIvs1lduvk8U'
    return this.airtableService.createHook(body.baseId);
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  list(@Query() query: BaseDto) {
    return this.airtableService.listWebhooks(query.baseId);
  }

  @Delete('/')
  @HttpCode(HttpStatus.OK)
  deleteHook(@Body() body: DeleteHookDto) {
    return this.airtableService.deleteWebhook(body.baseId, body.webhookId);
  }

  @Get('/info/tables')
  @HttpCode(HttpStatus.OK)
  tables(@Query() query: BaseDto) {
    return this.airtableService.getDataTable(query.baseId);
  }

  @Post('/hook')
  @HttpCode(HttpStatus.OK)
  async hook(@Body() body: HookDto): Promise<any> {
    const result = await this.airtableService.getPayload(
      body.base.id,
      body.webhook.id,
    );
    // sorted by time
    result.payloads.sort((a, b) => {
      return new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1;
    });
    // in real app we need to check number of last baseTransactionNumber
    // and find it but if we miss something
    // we can call task for each lost transaction
    // for demonstrate we get last
    /*
      https://airtable.com/developers/web/api/model/change-events-data#changedtablesbyid
      we have created/changes/destroyed but I believe now we need only changedtablesbyid
     */
    if (result.payloads[0].changedTablesById) {
      const changes = result.payloads[0].changedTablesById;
      const formatedData = await this.airtableService.formatItemData(
        changes,
        body.base.id,
      );
      console.log(formatedData);
      // get services
      // we can create big object for full updates,
      // but now it's just a simple data and
      // instead circle it's just single object
      const servicesPayloads = {};
      const records = Object.keys(formatedData);
      records.forEach((record) => {
        const fields = formatedData[record];
        Object.keys(fields).forEach((key) => {
          const keyParts = key.split('.');
          const service = keyParts[0];
          if (!servicesPayloads[service]) servicesPayloads[service] = [];
          servicesPayloads[service].push({
            _id: record,
            payload: {
              [keyParts.slice(1, keyParts.length).join('.')]: fields[key],
            },
          });
        });
      });
      console.log(JSON.stringify(servicesPayloads, null, 2));
      Object.keys(servicesPayloads).forEach((key) => {
        let integration: any = null;
        // find integration on our database
        if (key === 'someMongoId') {
          integration = IntegrationMongodb;
        }
        if (key === 'someAnotherMongoId') {
          integration = IntegrationAnotherMongo;
        }
        return this.client.send(integration!.type, {
          integrationId: integration!._id,
          data: servicesPayloads[key],
        });
      });
    }
  }
}
