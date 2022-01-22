import { SetMetadata } from '@nestjs/common';

export const NO_JWT = 'NO_JWT';
export const NoJwt = (noJwt = true) => SetMetadata(NO_JWT, noJwt);
