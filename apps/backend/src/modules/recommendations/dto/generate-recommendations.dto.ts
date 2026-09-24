import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

const LEVELS = ['Low', 'Medium', 'High'];

// Espelha exatamente as colunas de adotante usadas em apps/ml/src/config/settings.py
export class AdopterProfileDto {
  @IsIn(['Apartment', 'House'])
  home_type: string;

  @IsBoolean()
  has_yard: boolean;

  @IsBoolean()
  has_children: boolean;

  @IsString()
  children_age_group: string;

  @IsBoolean()
  has_other_pets: boolean;

  @IsString()
  other_pets_type: string;

  @IsIn(['Beginner', 'Intermediate', 'Experienced'])
  dog_experience: string;

  @IsIn(LEVELS)
  available_time: string;

  @IsIn(LEVELS)
  activity_level: string;

  @IsIn(['Small', 'Medium', 'Large'])
  preferred_size: string;

  @IsString()
  preferred_age: string;
}

export class GenerateRecommendationsDto {
  @IsInt()
  adopterId: number;

  @ValidateNested()
  @Type(() => AdopterProfileDto)
  profile: AdopterProfileDto;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  topN?: number;
}
