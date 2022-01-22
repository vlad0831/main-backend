import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PersonaKeyInflection } from './types';

@Injectable()
export class PersonaApiHttpConfigService implements HttpModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: this.configService.get(
        'PERSONA_API_BASE_URL',
        'https://withpersona.com/api/v1'
      ),
      headers: {
        'Key-Inflection': PersonaKeyInflection.camel,
        Accept: 'application/json',
        Authorization: `Bearer ${this.configService.get('PERSONA_API_KEY')}`,
      },
    };
  }
}
