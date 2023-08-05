import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { mysqlConfig } from '../dbs/init.mysql';
import { UploadModule } from './upload/upload.module';
import { EventModule } from './event/event.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FaqModule } from './faq/faq.module';
import { GeneralModule } from './general/general.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(mysqlConfig),
    UserModule,
    UploadModule,
    EventModule,
    FeedbackModule,
    FaqModule,
    GeneralModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
