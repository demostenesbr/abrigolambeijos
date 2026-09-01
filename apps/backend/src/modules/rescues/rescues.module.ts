import { Module } from '@nestjs/common';
import { RescuesService } from './rescues.service';
import { RescuesController } from './rescues.controller';

@Module({
  controllers: [RescuesController],
  providers: [RescuesService],
})
export class RescuesModule {}
