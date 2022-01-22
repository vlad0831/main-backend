import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  constructor(private readonly configService: ConfigService) {}

  public userPoolId: string = this.configService.get('COGNITO_USER_POOL_ID');
  public clientId: string = this.configService.get('COGNITO_CLIENT_ID');
  public region: string = this.configService.get('COGNITO_REGION');
  public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}
