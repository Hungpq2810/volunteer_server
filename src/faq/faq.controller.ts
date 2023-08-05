import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { Roles } from 'src/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles.guard';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { SuccessResponse } from 'src/utils/success';
import { UpdateFaqDto } from './dtos/update-faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Post()
  async create(@Body() body: CreateFaqDto) {
    return SuccessResponse.send('Create new faq', {
      faq: await this.faqService.createFaq(body.question, body.answer),
    });
  }

  @Get()
  async find() {
    return SuccessResponse.send('Get all faq', {
      faqs: await this.faqService.find(),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return SuccessResponse.send('Get faq', {
      faq: await this.faqService.findOne(id),
    });
  }

  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch(':id')
  async updateFaq(@Param('id') id: string, @Body() body: UpdateFaqDto) {
    return SuccessResponse.send('Update faq', {
      faq: await this.faqService.update(id, body),
    });
  }

  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return SuccessResponse.send('Delete faq', {
      faq: await this.faqService.remove(id),
    });
  }
}
