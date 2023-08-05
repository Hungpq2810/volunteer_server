import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from './faq.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}
  createFaq(question: string, answer: string) {
    const faq = this.faqRepository.create({ question, answer });
    return this.faqRepository.save(faq);
  }
  find() {
    return this.faqRepository.find();
  }

  findOne(id: string) {
    return this.faqRepository.findOne({
      where: {
        id,
      },
    });
  }
  async update(id: string, attrs: Partial<Faq>) {
    const faq = await this.findOne(id);
    Object.assign(faq, attrs);
    return this.faqRepository.save(faq);
  }

  async remove(id: string) {
    const faq = await this.findOne(id);
    return this.faqRepository.softRemove(faq);
  }
}
