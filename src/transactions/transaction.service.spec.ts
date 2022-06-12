import { TransactionService } from './transaction.service';
import { TestingModule, Test } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../entity/transaction.entity';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn().mockReturnValueOnce({
              amount: 100,
              currency: 'EUR',
              user: {
                id: 'test',
                username: 'test',
                password: 'hashedThing',
                privilegedCommission: false,
                transactions: [],
              },
              date: new Date().toString(),
              baseAmount: 100,
              baseCurrency: 'EUR',
            }),
            save: jest.fn(),
            findOneBy: jest
              .fn()
              .mockReturnValueOnce(null)
              .mockReturnValueOnce({
                amount: 100,
                currency: 'EUR',
              })
              .mockReturnValueOnce({
                amount: 1000,
                currency: 'EUR',
              })
              .mockReturnValueOnce({
                amount: 0.01,
                currency: 'EUR',
              }),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return a transaction when create is called', async () => {
    const transaction = await service.createTransaction({
      amount: 100,
      currency: 'EUR',
      user: {
        id: 'test',
        username: 'test',
        password: 'hashedThing',
        privilegedCommission: false,
        transactions: [],
      },
      date: new Date().toString(),
      baseAmount: 100,
      baseCurrency: 'EUR',
    });
    expect(transaction).toBeDefined();
    expect(transaction.amount).toBe(100);
    expect(transaction.currency).toBe('EUR');
    expect(transaction.user.id).toBe('test');
    expect(transaction.user.username).toBe('test');
    expect(transaction.user.password).toBe('hashedThing');
    expect(transaction.user.privilegedCommission).toBe(false);
    expect(transaction.user.transactions).toBeDefined();
    expect(transaction.date).toBeDefined();
    expect(transaction.baseAmount).toBe(100);
  });
  it('checkRules should return a lower commission when user is privileged', async () => {
    const commission = service.checkRules(10, true);
    expect(commission).toBe(0.05);
  });
  it('checkRules should return a higher commission when user is not privileged', async () => {
    const commission = service.checkRules(15, false);
    expect(commission).toBe(0.75);
  });
  it('commission should return a commission when amount is passed in the commission request', async () => {
    const commission = service.commission(1000, 'EUR', true);
    expect(commission).toBeDefined();
    expect(commission.currency).toBe('EUR');
    expect(commission.amount).toBe(0.05);

    const commission2 = service.commission(1000, 'EUR', false);
    expect(commission2).toBeDefined();
    expect(commission2.currency).toBe('EUR');
    expect(commission2.amount).toBe(50);

    const commission3 = service.commission(0.01, 'EUR', false);
    expect(commission3).toBeDefined();
    expect(commission3.currency).toBe('EUR');
    expect(commission3.amount).toBe(0.05);
  });
  it('commissionByTransactionId returns expected values', async () => {
    try {
      await service.commissionByTransactionId('test', true);
    } catch (err) {
      expect(err.message).toBe('Failed to get transaction commission');
    }

    const commission2 = await service.commissionByTransactionId('test', false);
    expect(commission2).toBeDefined();
    expect(commission2.currency).toBe('EUR');
    expect(commission2.amount).toBe(5);

    // privileged return 0.05 commission no matter what
    const commission3 = await service.commissionByTransactionId('test', true);
    expect(commission3).toBeDefined();
    expect(commission3.currency).toBe('EUR');
    expect(commission3.amount).toBe(0.05);

    // transaction amount <= 0.05 return 0.05 commission
    const commission4 = await service.commissionByTransactionId('test', false);
    expect(commission4).toBeDefined();
    expect(commission4.currency).toBe('EUR');
    expect(commission4.amount).toBe(0.05);
  });
});
