import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { AppService } from './app.service';
import { CheckPolicies } from './auth/decorator/checkPolicies';
import { CurrentUser } from './auth/decorator/currentUser';
import { PoliciesGuard } from './auth/policies.guard';
import { Action, RequestUserInfo } from './auth/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @UseGuards(PoliciesGuard)
  @Get()
  getCurrentUserInfo(@CurrentUser() user: RequestUserInfo): RequestUserInfo {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.MODIFY, CognitoUserPool))
  @Get('admin')
  getRoot(): string {
    return this.appService.getString('Access as admin!');
  }
}
