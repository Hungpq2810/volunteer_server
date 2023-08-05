import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Roles } from 'src/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles.guard';
import {
  CreateUserDto,
  OptionsQueryUser,
  UpdateUserDto,
} from '../dto/user.dto';
import { SuccessResponse } from 'src/utils/success';
import pick from 'src/utils/pick';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return SuccessResponse.send('Create user successful', {
      userId: user.id,
    });
  }
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Get(':userId')
  async getUser(@Param() { userId }) {
    return SuccessResponse.send('Get user successful', {
      user: pick(await this.userService.findUserById(userId), [
        'id',
        'username',
        'email',
        'name',
        'phoneNumber',
        'role',
      ]),
    });
  }
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete(':userId')
  async deleteUser(@Param() { userId }) {
    await this.userService.deleteUser(userId);
    return SuccessResponse.send('Delete user successful');
  }
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch(':userId')
  async updateUser(@Param() { userId }, @Body() body: UpdateUserDto) {
    return SuccessResponse.send('Update user successful', {
      userId: await this.userService.updateUserById(userId, body),
    });
  }
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Get('')
  async getUsers(@Query() query: OptionsQueryUser) {
    return SuccessResponse.send('Get all user successful', {
      users: await this.userService.getUsers(query),
    });
  }
}
