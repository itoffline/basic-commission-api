import {
  Body,
  Request,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import CreateTransactionDto from '../dto/createTransaction.dto';
import { TransactionService } from './transaction.service';
import { Commission } from '../types/commission';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('Transactions')
export class TransactionController {
  constructor(private readonly TransactionsService: TransactionService) {}

  // get all Transactions
  @UseGuards(JwtAuthGuard)
  @Get()
  getTransactions(@Request() req) {
    if (!req.user || !req.user.userId) {
      throw new Error('Failure to get transactions');
    }
    return this.TransactionsService.getMyTransactions(req.user.userId);
  }

  @Get('commission/:currency/:amount')
  commission(@Param() params): Commission {
    const { amount, currency } = params;
    if (!amount || !currency) {
      throw new Error('Must include amount and currency in request params!');
    }
    const { currency: resCurrency, amount: resAmount } =
      this.TransactionsService.commission(amount, currency, false);

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

  @UseGuards(JwtAuthGuard)
  @Get('commission/:id')
  async commissionByTransactionId(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Commission> {
    let privileged = false;
    if (req.user && req.user.privilegedCommission) {
      privileged = true;
    }
    try {
      const { amount: resAmount, currency: resCurrency } =
        await this.TransactionsService.commissionByTransactionId(
          id,
          privileged,
        );
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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getTransactionById(@Param('id') id, @Request() req) {
    return this.TransactionsService.getTransactionById({
      id,
      userId: req.user?.userId,
    });
  }

  // create Transaction
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(
    @Request() req,
    @Body() Transaction: CreateTransactionDto,
  ) {
    if (req.user && req.user.userId) {
      Transaction.user = req.user.userId;
    }
    return this.TransactionsService.createTransaction(Transaction);
  }

  //delete Transaction
  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    this.TransactionsService.deleteTransaction(id);
  }
}
