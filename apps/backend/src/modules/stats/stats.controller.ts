import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AdminOnly } from '../../common/decorators/admin-only.decorator';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getPublicStats() {
    return this.statsService.getPublicStats();
  }

  @Get('admin')
  @AdminOnly()
  getAdminOverview() {
    return this.statsService.getAdminOverview();
  }
}
