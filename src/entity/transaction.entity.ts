import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../entity/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  date: string;

  @Column()
  baseCurrency: string;

  @Column()
  baseAmount: number;
}
