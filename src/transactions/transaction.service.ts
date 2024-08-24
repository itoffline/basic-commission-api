import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateTransactionDto from '../dto/createTransaction.dto';
import { Transaction } from '../entity/transaction.entity';

import { Commission } from '../types/commission';
import { User } from '../entity/user.entity';

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

  checkRules(amount: number, privileged: boolean): number {
    // check if user is privileged
    // if user is privileged return 0.05 commission
    if (privileged) {
      return 0.05;
    }
    // default rule
    if (amount <= 0.05) {
      return 0.05;
    }
    return amount * 0.05;
  }

  // calculate commission
  commission(
    amount: number,
    currency: string,
    privileged: boolean,
  ): Commission {
    if (currency != 'EUR') {
      console.log('currency not EUR');
      console.log('must call exchange service which is not implemented yet');
      return {
        currency: 'EUR',
        amount: 0.05,
      };
    }
    const commission = this.checkRules(amount, privileged);
    return {
      currency: 'EUR',
      amount: commission,
    };
  }

  async commissionByTransactionId(
    id: number,
    privileged: boolean,
  ): Promise<Commission> {
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
        privileged,
      );
      return {
        currency: resCurrency,
        amount: resAmount,
      };
    } catch (err) {
      throw new Error('Failed to get transaction commission');
    }
  }

  // find by id
  async getTransactionById(params: { userId: number; id: number }) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: params.id,
        user: { id: params.userId },
      },
    });
    if (transaction) {
      return transaction;
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

  async getMyTransactions(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
    });
    return transactions;
  }
}
