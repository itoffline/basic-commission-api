import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateTransactionDto from './dto/createTransaction.dto';
import { Transaction } from './entity/transaction.entity';

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

  // find by id
  async getTransactionById(id: number) {
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
  async deleteTransaction(id: number) {
    const deletedTransaction = await this.transactionRepository.delete(id);
    if (!deletedTransaction.affected) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
  }
}
