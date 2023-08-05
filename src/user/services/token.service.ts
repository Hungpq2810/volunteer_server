import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../../configs/config';

enum TokenTypes {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  generateToken = (
    userId: string,
    expiresIn: number,
    type: TokenTypes,
    secret = config.jwt.secret,
  ) => {
    return this.jwtService.sign(
      { userId, type },
      { secret: secret, expiresIn: expiresIn },
    );
  };
  verifyToken = async (token: string) => {
    try {
      return this.jwtService.verify(token, {
        secret: config.jwt.secret,
      });
    } catch (error) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  };
  generateAuthTokens = (
    userId: string,
  ): {
    accessToken: string;
    refreshToken: string;
  } => {
    const accessTokenExpires = Number(config.jwt.accessExpirationMinutes) * 60;
    const accessToken = this.generateToken(
      userId,
      accessTokenExpires,
      TokenTypes.ACCESS,
    );

    const refreshTokenExpires =
      Number(config.jwt.refreshExpirationDays) * 86400;
    const refreshToken = this.generateToken(
      userId,
      refreshTokenExpires,
      TokenTypes.REFRESH,
    );

    return {
      accessToken,
      refreshToken,
    };
  };
}
