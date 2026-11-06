import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { MlBridgeService } from './ml-bridge.service';
import { ModelReportService } from './model-report.service';

@Module({
  controllers: [RecommendationsController],
  providers: [RecommendationsService, MlBridgeService, ModelReportService],
})
export class RecommendationsModule {}
