import { PartialType } from '@nestjs/mapped-types';
import { CreateRescueDto } from './create-rescue.dto';

export class UpdateRescueDto extends PartialType(CreateRescueDto) {}
