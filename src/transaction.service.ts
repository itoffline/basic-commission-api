import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateTransactionDto from './dto/createTransaction.dto';
import { Transaction } from './entity/transaction.entity';

import { Commission } from './types/commission';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  // find all
  getAllTransactions() {
    return this.transactionRepository.find();
  }

  // calculate commission
  commission(amount: number, currency: string): Commission {
    if (currency != 'EUR') {
      console.log('currency not EUR');
      console.log('must call exchange service which is not implemented yet');
      return {
        currency: 'EUR',
        amount: 0.05,
      };
    }
    const commission = amount * 0.05;
    return {
      currency: 'EUR',
      amount: commission,
    };
  }

  async commissionByTransactionId(id: string): Promise<Commission> {
    try {
      const transaction = await this.transactionRepository.findOneBy({
        id,
      });
      if (!transaction) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }
      const { amount, currency } = transaction;
      const { currency: resCurrency, amount: resAmount } = this.commission(
        amount,
        currency,
      );
      return {
        currency: resCurrency,
        amount: resAmount,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to get transaction commission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // find by id
  async getTransactionById(id: string) {
    const Transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (Transaction) {
      return Transaction;
    }

    throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
  }

  // create
  async createTransaction(Transaction: CreateTransactionDto) {
    const newTransaction = await this.transactionRepository.create(Transaction);
    await this.transactionRepository.save(newTransaction);

    return newTransaction;
  }

  // delete
  async deleteTransaction(id: string) {
    const deletedTransaction = await this.transactionRepository.delete(id);
    if (!deletedTransaction.affected) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
  }
}
