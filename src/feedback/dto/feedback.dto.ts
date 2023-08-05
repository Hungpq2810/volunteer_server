import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  content: string;
}
export class OptionsQueryFeedback {
  page?: string;
  limit?: string;
  email?: string;
}
