import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  animalname: string;

  @IsString()
  rganimal: string;

  @IsDateString()
  dateentry: string;

  @IsOptional()
  @IsString()
  petphoto?: string;

  @IsString()
  name: string;

  @IsString()
  race: string;

  @IsString()
  gender: string;

  @IsBoolean()
  microchipped: boolean;

  @IsOptional()
  @IsString()
  microchipnumber?: string;

  @IsBoolean()
  castrated: boolean;

  @IsString()
  coattypecoloration: string;

  @IsString()
  predominantcoatcolor: string;

  @IsString()
  signsanddistinctive: string;

  @IsInt()
  @Min(0)
  estimatedchronologicalage: number;

  @IsDateString()
  birthdate: string;

  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  behavioralprofile?: string;

  @IsOptional()
  @IsString()
  healthcondition?: string;

  @IsOptional()
  @IsString()
  redemptioncondition?: string;
}
