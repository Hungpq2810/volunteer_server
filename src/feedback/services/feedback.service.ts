import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from '../entities/feedback.entity';
import { Like, Repository } from 'typeorm';
import { CreateFeedbackDto, OptionsQueryFeedback } from '../dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(body: CreateFeedbackDto) {
    return this.feedbackRepository.save(body);
  }
  async getFeedbacks(query: OptionsQueryFeedback) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const skip = (page - 1) * limit;
    const [res, total] = await this.feedbackRepository.findAndCount({
      where: {
        email: query.email ? Like('%' + query.email + '%') : null,
      },
      take: limit,
      skip: skip,
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
