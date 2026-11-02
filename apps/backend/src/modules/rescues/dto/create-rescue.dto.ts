import { IsIn, IsOptional, IsString } from 'class-validator';

export const RESCUE_STATUSES = ['triage', 'in_treatment', 'recovered'] as const;

export class CreateRescueDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsIn(RESCUE_STATUSES)
  status?: string;
}
