import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';

describe('AppService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = app.get<AuthService>(AuthService);
  });
});
