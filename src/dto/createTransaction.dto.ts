export class CreateTransactionDto {
  amount: number;
  currency: string;
  client_id: string;
  date: string;
  commission: number;
  baseCurrency: string;
  baseAmount: number;
}

export default CreateTransactionDto;
