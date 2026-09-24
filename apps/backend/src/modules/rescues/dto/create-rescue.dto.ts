import { IsString } from 'class-validator';

export class CreateRescueDto {
  @IsString()
  name: string;

  @IsString()
  location: string;
}
