import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthConfig } from './auth.config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly authConfig: AuthConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: authConfig.authority,
      // access token does not have a `aud` key but a client_id
      // will validate manually on that
      algorithms: ['RS256'],
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),
    });
  }

  public async validate(payload: any) {
    const idTokenValidateRequest =
      this.authService.validateUserWithIdTokenPayload(payload);
    const accessTokenValidateRequest =
      this.authService.validateUserWithAccessTokenPayload(payload);
    // validate with an id token or access token (access token preferred)
    return (await accessTokenValidateRequest) || (await idTokenValidateRequest);
  }
}
