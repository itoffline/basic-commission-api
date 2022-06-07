import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import CreateTransactionDto from './dto/createTransaction.dto';
import { TransactionService } from './transaction.service';

@Controller('Transactions')
export class TransactionController {
  constructor(private readonly TransactionsService: TransactionService) {}

  // get all Transactions
  @Get()
  getTransactions() {
    return this.TransactionsService.getAllTransactions();
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
