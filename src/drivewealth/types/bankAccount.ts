export interface ProcessorTokenSettings {
  processorToken: string;
  userId: string;
  bankAccountNickname: string;
}

export interface BankAccountSettings {
  plaidPublicToken: string;
  userId: string;
  bankAccountNumber: string;
  bankRoutingNumber: string;
  bankAccountNickname: string;
}

export interface BankAccount {
  id: string;
  userDetails: {
    userID: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    parentIB: {
      id: string;
      name: string;
    };
    wlpID: string;
  };
  bankAccountDetails: {
    bankAccountNickname: string;
    bankAccountNumber: string;
    bankRoutingNumber: string;
  };
  status: string;
  created: string;
  updated: string;
}

export interface UserBankAccount {
  id: string;
  type: 'BANK_ACCOUNT';
  bankAccountDetails: {
    bankAccountNickname: string;
    bankAccountNumber: string;
    bankRoutingNumber: string;
  };
  default: boolean;
  status: string;
  created: string;
  updated: string;
}
