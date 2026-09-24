import { Module } from '@nestjs/common';
import { AdoptionRequestsService } from './adoption-requests.service';
import { AdoptionRequestsController } from './adoption-requests.controller';

@Module({
  controllers: [AdoptionRequestsController],
  providers: [AdoptionRequestsService],
})
export class AdoptionRequestsModule {}
