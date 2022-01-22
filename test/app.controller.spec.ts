import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { RequestUserInfo, Roles } from '../src/auth/types';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { loadConfigModule } from '../src/shared/utils/loadModule';

describe('AppController', () => {
  let appController: AppController;
  let mockUserInfo: RequestUserInfo;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [loadConfigModule(), AuthModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    mockUserInfo = {
      uuid: 'b8dd9d97-37da-44cb-9e9f-96da62f6d415',
      roles: [Roles.Admin],
      identity: 'john.smith@example.com',
    };
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getCurrentUserInfo(mockUserInfo)).toEqual(
        mockUserInfo
      );
    });
  });
});
