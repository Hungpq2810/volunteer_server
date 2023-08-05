import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { General } from './general.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GeneralService {
  constructor(
    @InjectRepository(General)
    private repo: Repository<General>,
  ) {}

  async save(attrs: Partial<General>) {
    const gen = await this.repo.findOne({
      where: {
        k: attrs.k,
      },
    });
    if (!gen) {
      const genCreate = this.repo.create(attrs);
      return this.repo.save(genCreate);
    }
    Object.assign(gen, attrs);
    return this.repo.save(gen);
  }

  async findOne(k: string) {
    const gen = await this.repo.findOne({
      where: {
        k: k,
      },
    });
    return gen;
  }
}
