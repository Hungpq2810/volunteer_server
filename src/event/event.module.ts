import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Event } from './entities/event.entity';
import { JwtStrategy } from 'src/user/jwt.strategy';
import { AuthService } from 'src/user/services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { TokenService } from 'src/user/services/token.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EventVolunteer } from './entities/eventVolunteer.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, User, EventVolunteer]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
  ],
  providers: [
    EventService,
    JwtStrategy,
    AuthService,
    UserService,
    TokenService,
    JwtService,
  ],
  controllers: [EventController],
  exports: [TypeOrmModule],
})
export class EventModule {}
