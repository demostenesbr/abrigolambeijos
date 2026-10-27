import { IsDateString, IsIn, IsInt, IsOptional } from 'class-validator';

export class CreateAdoptionDto {
  @IsInt()
  adopterId: number;

  @IsInt()
  animalId: number;

  @IsOptional()
  @IsDateString()
  adoptionDate?: string;

  @IsOptional()
  @IsIn(['in_progress', 'completed'])
  status?: string;
}
