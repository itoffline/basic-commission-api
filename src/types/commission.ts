export type Commission = {
  currency: string;
  amount: number;
};

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
}
