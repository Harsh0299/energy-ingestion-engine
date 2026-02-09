import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getVehiclePerformance(vehicleId: string) {
    const [vehicleAgg] = await this.prisma.$queryRaw<
      { total_dc: number; avg_temp: number }[]
    >`
      SELECT
        COALESCE(SUM("kwhDeliveredDc"), 0) AS total_dc,
        COALESCE(AVG("batteryTemp"), 0) AS avg_temp
      FROM "VehicleTelemetryHistory"
      WHERE "vehicleId" = ${vehicleId}
      AND timestamp >= now() - interval '24 hours'
    `;

    const [meterAgg] = await this.prisma.$queryRaw<
      { total_ac: number }[]
    >`
      SELECT
        COALESCE(SUM("kwhConsumedAc"), 0) AS total_ac
      FROM "MeterTelemetryHistory"
      WHERE "meterId" = ${vehicleId}
      AND timestamp >= now() - interval '24 hours'
    `;

    const totalDc = Number(vehicleAgg.total_dc);
    const totalAc = Number(meterAgg.total_ac);

    const efficiency =
      totalAc > 0 ? Number((totalDc / totalAc).toFixed(3)) : null;

    return {
      vehicleId,
      window: 'last_24_hours',
      totalEnergy: {
        acConsumedKwh: totalAc,
        dcDeliveredKwh: totalDc,
      },
      efficiencyRatio: efficiency,
      avgBatteryTemp: Number(vehicleAgg.avg_temp.toFixed(2)),
    };
  }
}
