import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const LEVELS = ['Low', 'Medium', 'High'];

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

  @IsOptional()
  @IsIn(['Dog', 'Cat'])
  species?: string;

  @IsOptional()
  @IsIn(LEVELS)
  energyLevel?: string;

  @IsOptional()
  @IsIn(['Affectionate', 'Calm', 'Independent', 'Playful', 'Territorial'])
  temperament?: string;

  @IsOptional()
  @IsIn(LEVELS)
  sociability?: string;

  @IsOptional()
  @IsIn(LEVELS)
  exerciseNeed?: string;

  @IsOptional()
  @IsIn(LEVELS)
  apartmentAdaptability?: string;

  @IsOptional()
  @IsBoolean()
  childrenCompatibility?: boolean;

  @IsOptional()
  @IsBoolean()
  dogsCompatibility?: boolean;

  @IsOptional()
  @IsBoolean()
  catsCompatibility?: boolean;
}
