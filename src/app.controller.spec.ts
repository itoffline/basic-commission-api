import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValueOnce({
              access_token: 'access_token',
            }),
          },
        },
        LocalStrategy,
        JwtService,
        UsersService,
        ConfigService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
    it('should return login access token', async () => {
      const mockReq = {
        user: {
          username: 'test',
          password: 'test',
        },
      };
      expect(await appController.login(mockReq)).toEqual({
        access_token: 'access_token',
      });
    });
  });
});
