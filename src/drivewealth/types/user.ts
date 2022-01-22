export interface UserSettings {
  firstName: string;
  lastName: string;
  phone: string;
  emailAddress: string;
  socialSecurityNumber: string;
  citizenship: string;
  usTaxPayer: boolean;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  street1: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  userType: {
    name: 'INDIVIDUAL_TRADER';
    description: 'Individual Trader';
  };
  status: {
    name: 'APPROVED' | 'PENDING';
    description: string;
  };
  parentIB: {
    id: string;
    name: string;
  };
  documents: [
    {
      type: 'ADDRESS_INFO';
      data: {
        street1: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
      };
      description: string;
    },
    {
      type: 'BASIC_INFO';
      data: {
        firstName: string;
        lastName: string;
        emailAddress: string;
        phone: string;
        country: string;
        language: string;
      };
      description: string;
    },
    {
      type: 'DISCLOSURES';
      data: {
        termsOfUse: boolean;
        rule14b: boolean;
        customerAgreement: boolean;
        findersFee: boolean;
        foreignFindersFee: boolean;
        marketDataAgreement: boolean;
        privacyPolicy: boolean;
        dataSharing: boolean;
        signedBy: string;
        signedWhen: string;
        iraAgreement: null;
        extendedHoursAgreement: boolean;
      };
      description: string;
    },
    {
      type: 'EMPLOYMENT_INFO';
      data: {
        status: string;
        company: string;
        broker: boolean;
        type: string;
        years: number;
        position: string;
      };
      description: string;
    },
    {
      type: 'IDENTIFICATION_INFO';
      data: {
        value: string;
        type: 'SSN';
        citizenship: string;
      };
      description: string;
    },
    {
      type: 'INVESTOR_PROFILE_INFO';
      data: {
        annualIncomeRange: string;
        investmentObjectives: 'ACTIVE_DAILY';
        investmentExperience: 'NONE';
        networthLiquidRange: string;
        networthTotalRange: string;
        riskTolerance: string;
      };
      description: string;
    },
    {
      type: 'PERSONAL_INFO';
      data: {
        birthdate: string;
      };
      description: string;
    },
    {
      type: 'TAX_INFO';
      data: {
        usTaxpayer: boolean;
        taxTreatyWithUS: boolean;
      };
      description: string;
    }
  ];
  wlpID: string;
  referralCode: string;
  createdWhen: string;
  updatedWhen: string;
}

export interface UserDetails {
  id: string;
  ackSignedWhen: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  countryID: string;
  displayName: string;
  dob: string;
  email: string;
  firstName: string;
  languageID: string;
  lastName: string;
  parentIB: {
    id: string;
    name: string;
  };
  phone: string;
  referralCode: string;
  stateProvince: string;
  wlpID: string;
  zipPostalCode: string;
  idNo: string;
  status: {
    name: 'APPROVED' | 'PENDING';
    description: string;
  };
  userType: {
    name: 'INDIVIDUAL_TRADER';
    description: string;
  };
  usCitizen: boolean;
  updatedWhen: string;
  brandAmbassador: boolean;
  employerBusiness: string;
  employmentStatus: {
    name: string;
    description: string;
  };
  citizenship: string;
  createdWhen: string;
  approvedWhen: string;
  approvedBy: string;
  marginDefault: number;
  ackCustomerAgreement: boolean;
  ackFindersFee: boolean;
  ackForeignFindersFee: boolean;
  ackJointCustomerAgreement: boolean;
  ackJointFindersFee: boolean;
  ackJointForeignFindersFee: boolean;
  ackJointMarketData: boolean;
  ackMarketData: boolean;
  ackSignedBy: string;
  termsOfUse: boolean;
  badPasswordCount: number;
  director: boolean;
  employerCompany: string;
  employerIsBroker: boolean;
  employmentPosition: string;
  employmentYears: number;
  jointEmployerIsBroker: boolean;
  investmentObjectives: {
    name: 'ACTIVE_DAILY';
    description: string;
  };
  investmentExperience: {
    name: string;
    description: string;
  };
  fundingSources: [];
  politicallyExposed: boolean;
  riskTolerance: string;
  userNoteQty: number;
  taxTreatyWithUS: boolean;
  avatarURL: string;
  annualIncomeRange: string;
  ackDisclosureRule14b: boolean;
  ackJointDisclosureRule14b: boolean;
  networthLiquidRange: string;
  networthTotalRange: string;
}
