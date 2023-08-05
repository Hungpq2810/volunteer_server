import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  RefreshTokenDto,
  UpdatePassword,
  UpdateUserDto,
} from '../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import pick from 'src/utils/pick';
import { SuccessResponse } from 'src/utils/success';
import { UserService } from '../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return SuccessResponse.send(
      'Register user successful',
      await this.authService.register(createUserDto),
    );
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return SuccessResponse.send(
      'Login user successful',
      await this.authService.login(loginUserDto),
    );
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  async getProfile(@Req() req: any) {
    return SuccessResponse.send('Get profile successful', {
      user: pick(req.user, [
        'id',
        'username',
        'email',
        'name',
        'phoneNumber',
        'role',
      ]),
    });
  }

  @UseGuards(AuthGuard())
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateUserBody: UpdateUserDto) {
    return SuccessResponse.send('Get profile successful', {
      user: await this.userService.updateUserById(req.user.id, updateUserBody),
    });
  }

  @UseGuards(AuthGuard())
  @Patch('password')
  async changePassword(
    @Req() req: any,
    @Body() updatePasswordBody: UpdatePassword,
  ) {
    const user = await this.userService.checkMatchPassword({
      userId: req.user.id,
      password: updatePasswordBody.old_password,
    });
    user.password = updatePasswordBody.new_password;

    return SuccessResponse.send('Change password successful', {
      userId: await this.userService.updateUserById(req.user.id, user),
    });
  }

  @UseGuards(AuthGuard())
  @Post('refresh-token')
  async refreshToken(@Req() req: any, @Body() body: RefreshTokenDto) {
    return SuccessResponse.send('Change password successful', {
      userId: await this.authService.refreshAuth(
        body.refreshToken,
        req.user.id,
      ),
    });
  }
}
