import { IsIn, IsOptional } from 'class-validator';

export class UpdateAdoptionRequestDto {
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;
}
