import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    const tokens = this.tokenService.generateAuthTokens(user.id);
    delete user.password;
    return {
      user: user,
      tokens,
    };
  }
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto);
    const tokens = this.tokenService.generateAuthTokens(user.id);
    delete user.password;
    return {
      user: user,
      tokens,
    };
  }
  async validateUser(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
  async refreshAuth(refreshToken: string, userId: string) {
    await this.tokenService.verifyToken(refreshToken);
    return this.tokenService.generateAuthTokens(userId);
  }
}
