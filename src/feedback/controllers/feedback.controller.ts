import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateFeedbackDto } from '../dto/feedback.dto';
import { SuccessResponse } from 'src/utils/success';
import { FeedbackService } from '../services/feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post()
  async createFeedback(@Body() body: CreateFeedbackDto) {
    return SuccessResponse.send('Create feedback successful', {
      feedback: await this.feedbackService.create(body),
    });
  }
  @Get()
  async getFeedbacks(@Query() query) {
    return SuccessResponse.send('Get list feedback successful', {
      feedback: await this.feedbackService.getFeedbacks(query),
    });
  }
}
