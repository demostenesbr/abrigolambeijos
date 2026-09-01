import { Module } from '@nestjs/common';
import { AdoptersService } from './adopters.service';
import { AdoptersController } from './adopters.controller';

@Module({
  controllers: [AdoptersController],
  providers: [AdoptersService],
})
export class AdoptersModule {}
