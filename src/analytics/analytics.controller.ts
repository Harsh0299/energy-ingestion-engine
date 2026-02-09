import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('performance/:vehicleId')
  async getPerformance(@Param('vehicleId') vehicleId: string) {
    return this.analyticsService.getVehiclePerformance(vehicleId);
  }

  @Get('summary')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=30')
  getSummary(@Query('range') range?: string) {
    return this.analyticsService.getSummary(range);
  }

  @Get('power-usage')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=30')
  getPowerUsage(@Query('range') range?: string) {
    return this.analyticsService.getPowerUsage(range);
  }

  @Get('sessions')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=30')
  getSessions(@Query('range') range?: string) {
    return this.analyticsService.getSessions(range);
  }

  @Get('activity')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=30')
  getActivity(
    @Query('range') range?: string,
    @Query('limit') limit = '20',
  ) {
    return this.analyticsService.getRecentActivity(
      range,
      Number(limit),
    );
  }
}
