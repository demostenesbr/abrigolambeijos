import { IsEmail, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  contact: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  description: string;

  @IsString()
  location: string;
}
