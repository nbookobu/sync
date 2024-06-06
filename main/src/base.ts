export const TOKEN =
  'patDTsI8M62qPQEoy.e2d47c78f7576d8f7443682f644498296b6b759c9071705425a00c6d1d44a1fb';

export const SYNC = {
  mapper: {
    'appdXoIvs1lduvk8U.tblDFMNNbtn8dbOCT': 'someMongoId.users._id',
    'appdXoIvs1lduvk8U.tblDFMNNbtn8dbOCT.fld7zkJK6pguI4fko':
      'someMongoId.users.name',

    'appdXoIvs1lduvk8U.tblDFMNNbtn8dbOCT.fld9z0NniNOY9zH25':
      'someMongoId.users.notes',

    'appdXoIvs1lduvk8U.tblDFMNNbtn8dbOCT.fld90DF70RRl1W3pe':
      'someAnotherMongoId.users.assignee', // for example
  },
  hookId: 'achuF7Fctfv0L7dVR',
  _id: 'anySyncId',
};

export const IntegrationMongodb = {
  auth: 'pass', // can be any but enough for auth
  _id: 'someMongoId',
  type: 'mongo-sync',
};

export const IntegrationAnotherMongo = {
  auth: 'another-pass', // can be any but enough for auth
  _id: 'someAnotherMongoId',
  type: 'mongo-sync',
};
