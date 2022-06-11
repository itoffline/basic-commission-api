import { Transaction } from '../entity/transaction.entity';
export class CreateUserDto {
  id: string;
  username: string;
  password: string;
  privilegedCommission: boolean;
  transactions: Transaction[];
}

export default CreateUserDto;
