export interface Configuration {
  clientAppKey: string;
  username: string;
  password: string;
  backOfficeUrl: string;
  wlpId: string;
  riaId: string;
  riaProductId: string;
}

export interface Country {
  id: string;
  name: string;
  code2: string;
  code3: string;
  active: boolean;
  expatsAllowed: boolean;
  taxTreatyCountry: boolean;
}

export interface DWError {
  errorCode: string;
  message: string;
}
