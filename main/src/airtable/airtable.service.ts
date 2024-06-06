import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SYNC } from '../base';
import { NewWebhook, Table, Webhook } from './types';

@Injectable()
export class AirtableService {
  constructor(private readonly httpService: HttpService) {}

  async createHook(baseId: string): Promise<NewWebhook> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>(`https://api.airtable.com/v0/bases/${baseId}/webhooks`, {
          notificationUrl:
            // some basic url into env
            'https://7fb4-5-187-4-150.ngrok-free.app/airtable/hook',
          specification: {
            options: {
              filters: {
                dataTypes: ['tableData'],
              },
            },
          },
        })
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async listWebhooks(baseId: string): Promise<{ webhooks: Webhook[] }> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(`https://api.airtable.com/v0/bases/${baseId}/webhooks`)
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async deleteWebhook(baseId: string, webhookId: string): Promise<void> {
    const { data } = await firstValueFrom(
      this.httpService
        .delete<any>(
          `https://api.airtable.com/v0/bases/${baseId}/webhooks/${webhookId}`,
        )
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getDataTable(baseId: string): Promise<{ tables: Table[] }> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`)
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getPayload(baseId: string, webhookId: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(
          `https://api.airtable.com/v0/bases/${baseId}/webhooks/${webhookId}/payloads`,
        )
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  formatItemData(payload: any, baseId: string, objectForSending: any = {}) {
    const sync = SYNC;
    const tableId = Object.keys(payload)[0];
    const table = payload[tableId];
    if (table.changedRecordsById) {
      const recordId = Object.keys(table.changedRecordsById)[0];
      const record = table.changedRecordsById[recordId].current;
      if (record.cellValuesByFieldId) {
        objectForSending[recordId] = {};
        const fieldId = Object.keys(record.cellValuesByFieldId)[0];
        const field = record.cellValuesByFieldId[fieldId];
        const mapField = sync.mapper[`${baseId}.${tableId}.${fieldId}`];
        if (mapField) {
          objectForSending[recordId][mapField] = field;
        }
      }
    }
    return objectForSending;
  }
}
