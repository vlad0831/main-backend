import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/currentUser';
import { NoJwt } from './decorator/noJwt';
import { AwsCognitoErrorCode } from './errorCode.enum';
import { PoliciesGuard } from './policies.guard';
import {
  AuthenticateRequestDTO,
  RegisterRequestDTO,
  RequestUserInfo,
  RestoreUserDTO,
} from './types';

@UseGuards(PoliciesGuard)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(AuthController.name);
  }

  @NoJwt()
  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDTO) {
    try {
      const result = await this.authService.registerUser(registerRequest);
      return !!result.userSub;
    } catch (err) {
      this.logger.debug(this.register.name, err);
      throw new BadRequestException(err.message);
    }
  }

  @NoJwt()
  @Post('login')
  async login(@Body() authenticateRequest: AuthenticateRequestDTO) {
    try {
      const { session } = await this.authService.authenticateUser(
        authenticateRequest
      );
      return { user: this.authService.extractUserData(session) };
    } catch (err) {
      this.logger.debug(this.login.name, err);
      if (err.code === AwsCognitoErrorCode.NotAuthorizedException) {
        throw new UnauthorizedException(err.message);
      }
      throw new BadRequestException(err.message);
    }
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @Body() { userId, ...userTokens }: RestoreUserDTO,
    @CurrentUser() requestUser: RequestUserInfo
  ) {
    if (userId) {
      await this.authService.checkCanAccessCognitoUser({
        requestUser,
        userId,
      });
    }

    try {
      const user = this.authService.getSignedInUser({
        userId: userId || requestUser.uuid,
        ...userTokens,
      });
      return await this.authService.signOutEverywhere(user);
    } catch (err) {
      this.logger.debug(this.logout.name, err);
      if (err.code === AwsCognitoErrorCode.NotAuthorizedException) {
        throw new UnauthorizedException(err.message);
      }
      throw new BadRequestException(err.message);
    }
  }
}
