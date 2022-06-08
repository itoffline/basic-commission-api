import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import CreateTransactionDto from './dto/createTransaction.dto';
import { TransactionService } from './transaction.service';
import { Commission } from './types/commission';

@Controller('Transactions')
export class TransactionController {
  constructor(private readonly TransactionsService: TransactionService) {}

  // get all Transactions
  @Get()
  getTransactions() {
    return this.TransactionsService.getAllTransactions();
  }

  @Get('commission/:currency/:amount')
  commission(@Param() params): Commission {
    const { amount, currency } = params;
    if (!amount || !currency) {
      throw new Error('Must include amount and currency in request params!');
    }
    const { currency: resCurrency, amount: resAmount } =
      this.TransactionsService.commission(amount, currency);

    // if the commission is 0.05 cents or above, return the calculated commission
    // if it is below 0.05 cents, return the minimum commission of 0.05 cents
    if (resAmount > 0.05) {
      return {
        currency: resCurrency,
        amount: resAmount,
      };
    }
    return {
      currency: resCurrency,
      amount: 0.05,
    };
  }

  @Get('commission/:id')
  async commissionByTransactionId(
    @Param('id') id: number,
  ): Promise<Commission> {
    try {
      const { amount: resAmount, currency: resCurrency } =
        await this.TransactionsService.commissionByTransactionId(id);
      if (!resAmount || !resCurrency) {
        throw new Error('Transaction not found');
      }
      if (resAmount > 0.05) {
        return {
          currency: resCurrency,
          amount: resAmount,
        };
      }
      return {
        currency: resCurrency,
        amount: 0.05,
      };
    } catch (err) {
      throw new Error('Failed to get transaction commission');
    }
  }

  // get Transaction by id
  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return this.TransactionsService.getTransactionById(Number(id));
  }

  // create Transaction
  @Post()
  async createTransaction(@Body() Transaction: CreateTransactionDto) {
    return this.TransactionsService.createTransaction(Transaction);
  }

  //delete Transaction
  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    this.TransactionsService.deleteTransaction(Number(id));
  }
}
