import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAdoptionRequestDto {
  @IsInt()
  adopterId: number;

  @IsInt()
  animalId: number;

  @IsString()
  petName: string;

  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  experience: string;

  @IsString()
  home: string;

  @IsOptional()
  @IsString()
  status?: string;
}
