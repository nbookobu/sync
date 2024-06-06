import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncService {
  getConfig() {
    return {
      identifier: 'mongodb',
      routes: {
        getAuthHeaders: 'http://localhost:3001/sync/$integrationId/auth',
        getGroups: 'http://localhost:3001/sync/$integrationId/groups',
        getFields: `http://localhost:3001/sync/$integrationId/groups/$groupId`,
      },
    };
  }

  async getAuth(integrationId: string) {
    // go to database and collect headers for requests
    return { Authorization: `Mega token + ${integrationId}` };
  }

  async getGroups(integrationId: string) {
    // go to database and collect table or it can be main or any group (general)
    return ['someTable1', 'someTable2', 'someTable3', integrationId];
  }

  async getFields(integrationId: string, groupId: string) {
    console.log(integrationId, groupId);
    // the same logic, go to group and get fields, can be hardcoded or to be in service
    return {
      someTable1: ['users', 'name'],
      someTable2: ['users', 'name'],
      someTable3: ['users', 'name'],
      [integrationId]: ['users', 'name', 'notes'],
    }[groupId];
  }
}
