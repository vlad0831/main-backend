import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [PassportModule],
  providers: [AuthConfig, AuthService, JwtStrategy, CaslAbilityFactory],
  controllers: [AuthController],
  exports: [AuthConfig, CaslAbilityFactory],
})
export class AuthModule {}
