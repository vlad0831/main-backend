import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { BadRequestError } from '../shared/errors';
import { AxiosError, AxiosResponse } from 'axios';
import { PersonaInquiryDto } from './dto/personaInquiryData';
import { PersonaAccountDto } from './dto/personaAccountData';

export class PersonaApiService {
  private readonly logger: Logger;
  public constructor(private readonly httpService: HttpService) {
    this.logger = new Logger(PersonaApiService.name);
  }

  private catchError(err: AxiosError): Observable<never> {
    return throwError(() => {
      this.logger.error(
        `Persona request error - ${err.response?.data}, code - ${err.code}`
      );

      return new BadRequestError('Persona request Error', {
        details: err.response?.data,
      });
    });
  }

  public async retrieveAnAccount(
    accountId: string
  ): Promise<PersonaAccountDto> {
    const url = `accounts/${accountId}`;
    const { data }: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.catchError))
    );
    return data;
  }

  public async retrieveAnInquiry(
    inquiryId: string
  ): Promise<PersonaInquiryDto> {
    const url = `inquiries/${inquiryId}`;
    const { data }: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.catchError))
    );
    return data;
  }
}
