import { IsString, MaxLength, Matches } from 'class-validator';

export class SubmitAdoptionRequestDto {
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  animalReference: string;

  @IsString()
  @Matches(/\S/)
  @MaxLength(30)
  phone: string;

  @IsString()
  @Matches(/\S/)
  @MaxLength(300)
  address: string;

  @IsString()
  @Matches(/\S/)
  @MaxLength(2000)
  experience: string;

  @IsString()
  @Matches(/\S/)
  @MaxLength(2000)
  home: string;
}
