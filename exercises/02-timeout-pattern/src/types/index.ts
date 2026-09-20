export type Payer = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  countryCode: string | null;
  state: string | null;
  streetAddress: string | null;
  streetName: string | null;
  website: string | null;
  dateOfBirth: string | null;
  profileImage: string | null;
  bioText: string | null;
};

export type Beneficiary = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  countryCode: string | null;
  state: string | null;
  streetAddress: string | null;
  streetName: string | null;
  website: string | null;
  dateOfBirth: string | null;
  profileImage: string | null;
  bioText: string | null;
};

export type Transaction = {
  id: string;
  createdAt: string;
  updatedAt: string;
  executionDate: string;
  cardNumber: string;
  cardExpirationDate: string;
  cardType: string;
  amount: number;
  isDomestic: boolean;
  payer: Payer;
  beneficiary: Beneficiary;
};

export type TransactionDashboardData = {
  totalAmount: number;
  domesticCount: number;
  internationalCount: number;
  amountsByCardType: Record<string, number>;
}