import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateAdoptionDto {
  @IsInt()
  adopterId: number;

  @IsInt()
  animalId: number;

  @IsOptional()
  @IsDateString()
  adoptionDate?: string;
}
