import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { Logger } from '@nestjs/common';
import {
  AuthenticationDetails,
  CodeDeliveryDetails,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import {
  AuthenticateRequestDTO,
  RegisterRequestDTO,
  RequestUserInfo,
  TokenResponseDTO,
  CodeDeliveryDetailsDTO,
  RestoreUserDTO,
  Action,
} from './types';
import { promisify } from 'util';
import { CaslAbilityFactory } from './casl-ability.factory';

const SUCCESS = 'SUCCESS';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  private readonly userPool: CognitoUserPool;
  constructor(
    private readonly authConfig: AuthConfig,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {
    this.logger = new Logger(AuthService.name);
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  getUser(identity: string) {
    return new CognitoUser({
      Username: identity,
      Pool: this.userPool,
    });
  }

  getSignedInUser({
    userId,
    idToken,
    accessToken,
    refreshToken,
  }: RestoreUserDTO) {
    const user = this.getUser(userId);
    const session = new CognitoUserSession({
      IdToken: new CognitoIdToken({ IdToken: idToken }),
      AccessToken: new CognitoAccessToken({ AccessToken: accessToken }),
      RefreshToken: new CognitoRefreshToken({ RefreshToken: refreshToken }),
    });
    user.setSignInUserSession(session);
    return user;
  }

  async checkCanAccessCognitoUser({
    requestUser,
    userId,
    action = Action.ACCESS,
  }: {
    requestUser: RequestUserInfo;
    userId: string;
    action?: Action;
  }) {
    return await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action,
      subject: CognitoUserPool,
    });
  }

  async registerUser({
    password,
    ...userInfo
  }: RegisterRequestDTO): Promise<ISignUpResult> {
    const extractedUserInfo: Omit<RegisterRequestDTO, 'password'> = userInfo;
    const userAttributes = Object.entries(extractedUserInfo).map(
      ([Name, Value]) =>
        new CognitoUserAttribute({
          Name,
          Value,
        })
    );

    return promisify(this.userPool.signUp.bind(this.userPool))(
      userInfo.email,
      password,
      userAttributes,
      null
    );
  }

  async authenticateUser({ identity, password }: AuthenticateRequestDTO) {
    const authenticationDetails = new AuthenticationDetails({
      Username: identity,
      Password: password,
    });

    const user = this.getUser(identity);

    return new Promise<{
      user: CognitoUser;
      session?: CognitoUserSession;
      codeDeliveryDetails?: CodeDeliveryDetails;
    }>((resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          resolve({ user, session });
        },
        onFailure: (err) => {
          reject(err);
        },
        mfaRequired: (codeDeliveryDetails) => {
          resolve({ user, codeDeliveryDetails });
        },
      });
    });
  }

  async signOutEverywhere(user: CognitoUser) {
    const result = await new Promise<string>((resolve, reject) => {
      user.globalSignOut({
        onSuccess: (message) => {
          resolve(message);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
    return result === SUCCESS;
  }

  async validateUserWithIdTokenPayload(
    payload: Record<string, any>
  ): Promise<RequestUserInfo> {
    if (
      // must be an id token from the AWS Cognito
      payload.token_use !== 'id' ||
      // must be issued from the same AWS Cognito region
      // (actually this is handled by jwt strategy already)
      this.authConfig.authority !== payload.iss ||
      // must refer to the same AWS Cognito user pool
      this.authConfig.clientId !== payload.aud
    ) {
      return;
    }
    return {
      uuid: payload?.sub,
      identity: payload?.email,
      roles: payload?.['cognito:groups'] ?? [],
    };
  }

  async validateUserWithAccessTokenPayload(
    payload: Record<string, any>
  ): Promise<RequestUserInfo> {
    if (
      // must be an access token from the AWS Cognito
      payload.token_use !== 'access' ||
      // must be issued from the same AWS Cognito region
      // (actually this is handled by jwt strategy already)
      this.authConfig.authority !== payload.iss ||
      // must refer to the same AWS Cognito user pool
      this.authConfig.clientId !== payload.client_id
    ) {
      return;
    }
    return {
      uuid: payload?.sub,
      identity: payload?.username,
      roles: payload?.['cognito:groups'] ?? [],
    };
  }

  extractUserData(session: CognitoUserSession): TokenResponseDTO {
    const cognitoIdToken = session.getIdToken();
    return {
      idToken: cognitoIdToken.getJwtToken(),
      accessToken: session.getAccessToken().getJwtToken(),
      refreshToken: session.getRefreshToken().getToken(),
      userId: cognitoIdToken.payload?.sub,
    };
  }

  extractCodeDeliveryDetails({
    AttributeName: attributeName,
    DeliveryMedium: deliveryMedium,
    Destination: destination,
  }: CodeDeliveryDetails): CodeDeliveryDetailsDTO {
    return {
      attributeName,
      deliveryMedium,
      destination,
    };
  }
}
