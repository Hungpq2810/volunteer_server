import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateFaqDto {
  @IsString()
  @IsOptional()
  question: string;

  @IsString()
  @IsOptional()
  answer: string;
}
