import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../entity/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @ManyToOne(() => User, (user) => user.id)
  user: string;

  @Column()
  date: string;

  @Column()
  commission: number;

  @Column()
  baseCurrency: string;

  @Column()
  baseAmount: number;
}
