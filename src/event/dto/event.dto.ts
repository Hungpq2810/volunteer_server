import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export enum CategoryEvent {
  EDUCATION = 'Education',
  VOLUNTEER = 'Volunteer',
  SUBSIDIZED = 'Subsidized',
}

export enum StatusEvent {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECT = 'REJECT',
}

export class CreateEventDto {
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsEnum(CategoryEvent)
  category: CategoryEvent;
  @IsNotEmpty()
  location: string;
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  maxVolunteers: number;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
  creator: string;
  link: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

export class OptionsQueryEvent {
  page?: string;
  limit?: string;
  category?: string;
  location?: string;
  name?: string;
  creator?: string;
  startDate?: string;
  endDate?: string;
  status?: StatusEvent;
}
