import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export const DONATION_TYPES = ['one_time', 'monthly'] as const;
export const DONATION_METHODS = ['pix', 'card', 'boleto'] as const;
export const DONATION_STATUSES = ['confirmed', 'pending', 'refunded'] as const;

export class CreateDonationDto {
  @IsString()
  donorName: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsIn(DONATION_TYPES)
  type?: string;

  @IsOptional()
  @IsIn(DONATION_METHODS)
  method?: string;

  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsIn(DONATION_STATUSES)
  status?: string;
}
