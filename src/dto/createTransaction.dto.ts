import { User } from '../entity/user.entity';
export class CreateTransactionDto {
  amount: number;
  currency: string;
  user: User;
  date: string;
  baseCurrency: string;
  baseAmount: number;
}

export default CreateTransactionDto;
