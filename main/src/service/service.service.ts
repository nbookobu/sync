import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '../airtable/types';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ServiceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly httpService: HttpService,
  ) {}

  async getAuth(serviceId: string) {
    const configService: ConfigService = await this.cacheService.get(serviceId);
    if (!configService) {
      throw new BadRequestException("Service doesn't connected yet");
    }
    const url = configService.routes.getAuthHeaders.replace(
      '$integrationId',
      'integrationId',
    );
    const { data: headers } = await firstValueFrom(
      this.httpService
        .get<{
          Authorization: string;
        }>(url)
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
    // someId from database
    return {
      headers,
      service: configService,
    };
  }

  async getGroups(serviceId: string) {
    const { headers: authHeaders, service } = await this.getAuth(serviceId);
    const url = service.routes.getGroups.replace(
      '$integrationId',
      'integrationId',
    );
    return await firstValueFrom(
      this.httpService
        .get<any>(url, {
          headers: authHeaders,
        })
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
  }

  async getFields(serviceId: string, groupId: string) {
    const { headers: authHeaders, service } = await this.getAuth(serviceId);
    const url = service.routes.getFields
      .replace('$groupId', groupId)
      .replace('$integrationId', 'integrationId');
    return await firstValueFrom(
      this.httpService
        .get<any>(url, {
          headers: authHeaders,
        })
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'An error happened!';
          }),
        ),
    );
  }
}
