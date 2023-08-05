import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  CreateUserDto,
  LoginUserDto,
  OptionsQueryUser,
  UpdateUserDto,
} from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    userDto.password = await bcrypt.hash(userDto.password, 10);

    // check email exists
    let userInDb = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });
    if (userInDb) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // check username exists
    userInDb = await this.userRepository.findOne({
      where: {
        username: userDto.username,
      },
    });
    if (userInDb) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userRepository.save(userDto);
  }
  async findByLogin({ username, password }: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const is_equal = bcrypt.compareSync(password, user.password);

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async checkMatchPassword({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const is_equal = bcrypt.compareSync(password, user.password);

    if (!is_equal) {
      throw new HttpException('Old password wrong', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findUserById(userId: string) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async updateUserById(userId: string, updateUserBody: UpdateUserDto) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUserBody);
    if (updateUserBody.password) {
      user.password = await bcrypt.hash(updateUserBody.password, 10);
    }
    await this.userRepository.update(userId, user);
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.softDelete(userId);
  }

  async getUsers(query: OptionsQueryUser) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const skip = (page - 1) * limit;
    const keyword = query.keyword || '';
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { username: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') },
        { name: Like('%' + keyword + '%') },
      ],
      // order: { created_at: "DESC" },
      take: limit,
      skip: skip,
      select: [
        'id',
        'username',
        'email',
        'name',
        'phoneNumber',
        'createdAt',
        'updatedAt',
        'role',
      ],
    });
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currenPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }
}
