import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let transactionController: TransactionController;

  describe('commission', () => {
    beforeEach(async () => {
      const app: TestingModule = await Test.createTestingModule({
        controllers: [TransactionController],
        providers: [
          {
            provide: TransactionService,
            useValue: {
              commission: jest
                .fn()
                .mockReturnValueOnce({
                  currency: 'EUR',
                  amount: 0.02,
                })
                .mockReturnValueOnce({
                  currency: 'EUR',
                  amount: 10,
                }),
            },
          },
        ],
      }).compile();

      transactionController = app.get<TransactionController>(
        TransactionController,
      );
    });

    it('should fail when amount is not passed in the commission request', () => {
      const params = {
        amount: '',
        currency: 'EUR',
      };
      expect(() => transactionController.commission(params)).toThrow(
        'Must include amount and currency in request params!',
      );
    });
    it('should fail when currency is not passed in the commission request', () => {
      const params = {
        amount: 100,
        currency: '',
      };
      expect(() => transactionController.commission(params)).toThrow(
        'Must include amount and currency in request params!',
      );
    });
    it('should return commissions above and below 0.05 when amount is passed in the commission request', () => {
      const params = {
        amount: 100,
        currency: 'EUR',
      };
      expect(transactionController.commission(params)).toEqual({
        currency: 'EUR',
        amount: 0.05,
      });
      expect(transactionController.commission(params)).toEqual({
        currency: 'EUR',
        amount: 10,
      });
    });
  });
  describe('commissionByTransactionId failures', () => {
    beforeEach(async () => {
      const app: TestingModule = await Test.createTestingModule({
        controllers: [TransactionController],
        providers: [
          {
            provide: TransactionService,
            useValue: {
              commissionByTransactionId: jest
                .fn()
                .mockResolvedValueOnce({
                  currency: '',
                  amount: 0.02,
                })
                .mockResolvedValueOnce({
                  currency: 'EUR',
                })
                .mockResolvedValueOnce({
                  currency: 'EUR',
                  amount: 10,
                })
                .mockResolvedValueOnce({
                  currency: 'EUR',
                  amount: 0.05,
                }),
            },
          },
        ],
      }).compile();

      transactionController = app.get<TransactionController>(
        TransactionController,
      );
    });
    it('should fail when the commissionByTransactionId returns currency or amount empty value and pass', async () => {
      try {
        await transactionController.commissionByTransactionId(
          '5f3f8f8b-f8b8-4f8b-8f8b-8f8b8f8b8f8b',
          false,
        );
      } catch (err) {
        expect(err.message).toBe('Failed to get transaction commission');
      }
      try {
        await transactionController.commissionByTransactionId(
          '5f3f8f8b-f8b8-4f8b-8f8b-8f8b8f8b8f8b',
          false,
        );
      } catch (err) {
        expect(err.message).toBe('Failed to get transaction commission');
      }
    });
  });
  describe('commissionByTransactionId success', () => {
    beforeEach(async () => {
      const app: TestingModule = await Test.createTestingModule({
        controllers: [TransactionController],
        providers: [
          {
            provide: TransactionService,
            useValue: {
              commissionByTransactionId: jest
                .fn()
                .mockResolvedValueOnce({
                  currency: 'EUR',
                  amount: 10,
                })
                .mockResolvedValueOnce({
                  currency: 'EUR',
                  amount: 0.02,
                }),
            },
          },
        ],
      }).compile();

      transactionController = app.get<TransactionController>(
        TransactionController,
      );
    });
    it('should return above 0.05 cents commission result and above', async () => {
      const res1 = await transactionController.commissionByTransactionId(
        '5f3f8f8b-f8b8-4f8b-8f8b-8f8b8f8b8f8b',
        false,
      );
      const res2 = await transactionController.commissionByTransactionId(
        '5f3f8f8b-f8b8-4f8b-8f8b-8f8b8f8b8f8b',
        false,
      );
      expect(res1).toEqual({
        currency: 'EUR',
        amount: 10,
      });
      expect(res2).toEqual({
        currency: 'EUR',
        amount: 0.05,
      });
    });
  });
});
