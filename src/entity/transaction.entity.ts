import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  client_id: string;

  @Column()
  date: string;

  @Column()
  commission: number;

  @Column()
  baseCurrency: string;

  @Column()
  baseAmount: number;
}
