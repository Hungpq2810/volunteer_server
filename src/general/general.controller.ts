import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GeneralService } from './general.service';
import { Roles } from 'src/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles.guard';
import { General } from './general.entity';
import { SuccessResponse } from 'src/utils/success';

@Controller('general')
export class GeneralController {
  constructor(private readonly genService: GeneralService) {}

  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Post()
  async save(@Body() attr: Partial<General>) {
    return SuccessResponse.send('save success', {
      gen: await this.genService.save(attr),
    });
  }

  @Get('/:k')
  async get(@Param('k') k: string) {
    return SuccessResponse.send('get success', {
      gen: await this.genService.findOne(k),
    });
  }
}
