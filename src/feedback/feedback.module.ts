import { Module } from '@nestjs/common';
import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackService } from './services/feedback.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
