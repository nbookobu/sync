export type ConfigService = {
  identifier: string;
  routes: {
    getGroups: string;
    getFields: string;
    getAuthHeaders: string;
  };
};

export type NewWebhook = {
  id: string;
  macSecretBase64: string;
  expirationTime: string;
};

export type Webhook = {
  id: string;
  specification: {
    options: {
      filters: {
        dataTypes: string[];
      };
    };
  };
  notificationUrl: string;
  cursorForNextPayload: number;
  lastNotificationResult: {
    success: boolean;
    completionTimestamp: string;
    durationMs: number;
    retryNumber: number;
    error?: {
      message: string;
    };
    willBeRetried: boolean;
  };
  areNotificationsEnabled: boolean;
  lastSuccessfulNotificationTime: string;
  isHookEnabled: boolean;
  expirationTime: string;
};

export type Table = {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: {
    type: string;
    id: string;
    name: string;
  }[];
  views: {
    id: string;
    name: string;
    type: string;
  }[];
};
