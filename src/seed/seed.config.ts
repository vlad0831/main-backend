import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedConfig {
  private readonly allioEnv: string;

  constructor(private readonly configService: ConfigService) {
    this.allioEnv = this.configService.get('ALLIO_ENV');
  }

  public get isDev() {
    return this.allioEnv === 'dev';
  }

  public getUserId(): string {
    if (this.isDev) {
      return 'c0414693-e7eb-46b3-9689-856b4de83940';
    }

    throw new Error('Seed userId is not defined for current env');
  }
}
