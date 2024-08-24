import { Transaction } from '../entity/transaction.entity';
export class CreateUserDto {
  id: number;
  username: string;
  password: string;
  privilegedCommission: boolean;
  transactions: Transaction[];
}

export default CreateUserDto;
