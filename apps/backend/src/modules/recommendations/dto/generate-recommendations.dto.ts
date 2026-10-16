import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
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

  @IsIn(['CHILDREN_0_5', 'CHILDREN_6_12', 'CHILDREN_13_17', 'NOT_APPLICABLE'])
  children_age_group: string;

  @IsBoolean()
  has_other_pets: boolean;

  @IsIn(['CAT', 'DOG', 'NONE'])
  other_pets_type: string;

  @IsIn(['Beginner', 'Intermediate', 'Experienced'])
  dog_experience: string;

  @IsIn(LEVELS)
  available_time: string;

  @IsIn(LEVELS)
  activity_level: string;

  @IsIn(['Small', 'Medium', 'Large'])
  preferred_size: string;

  @IsIn(['Filhote', 'Adulto', 'Idoso'])
  preferred_age: string;
}

export class GenerateMyRecommendationsDto {
  @ValidateNested()
  @Type(() => AdopterProfileDto)
  profile: AdopterProfileDto;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  topN?: number;
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
