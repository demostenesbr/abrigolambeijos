import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateDonationDto {
  @IsString()
  donorName: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
