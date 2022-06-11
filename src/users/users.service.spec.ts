import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<Record<string, unknown>>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // ...
  }),
);

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValueOnce({
              username: 'test',
              password: 'test',
            }),
            save: jest.fn().mockReturnValueOnce({
              id: 'test',
              username: 'test',
              password: 'test',
              privilegedCommission: false,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user when findOne is called', async () => {
    const user = await service.findOne('test');
    expect(user).toBeDefined();
    expect(user.username).toBe('test');
    expect(user.password).toBe('test');
  });

  it('should return a user when create is called', async () => {
    const user = await service.create({
      id: 'test',
      username: 'test',
      password: 'test',
      privilegedCommission: false,
      transactions: [],
    });
    expect(user).toBeDefined();
    expect(user.id).toBe('test');
    expect(user.username).toBe('test');
    expect(user.password).toBe('test');
    expect(user.privilegedCommission).toBe(false);
  });
});
