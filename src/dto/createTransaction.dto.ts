import { User } from '../entity/user.entity';
export class CreateTransactionDto {
  amount: number;
  currency: string;
  user: User;
  date: string;
  commission: number;
  baseCurrency: string;
  baseAmount: number;
}

export default CreateTransactionDto;
