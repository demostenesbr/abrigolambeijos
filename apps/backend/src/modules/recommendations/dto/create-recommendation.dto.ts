import { IsInt, IsString } from 'class-validator';

export class CreateRecommendationDto {
  @IsInt()
  adopterId: number;

  @IsInt()
  animalId: number;

  @IsString()
  recommendationText: string;
}
