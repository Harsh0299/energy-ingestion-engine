import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { resolveRange } from './analytics-range.util';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) { }

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

  async getSummary(range?: string) {
    const { range: resolvedRange, fromSql } = resolveRange(range);

    const [
      totalMeters,
      totalVehicles,
      energyAgg,
    ] = await Promise.all([
      this.prisma.liveMeterState.count(),
      this.prisma.liveVehicleState.count(),

      this.prisma.$queryRaw<{ total: number }[]>`
        SELECT COALESCE(SUM("kwhConsumedAc"), 0) AS total
        FROM "MeterTelemetryHistory"
        WHERE "timestamp" >= ${Prisma.raw(fromSql)}
      `,
    ]);

    return {
      range: resolvedRange,
      totalMeters,
      totalVehicles,
      activeMeters: 0, // Need to update
      activeChargingSessions: 0, // Need to update
      totalEnergyLast24hKwh: Number(energyAgg[0]?.total ?? 0),
      averageChargingTimeMinutes: 0,
    };
  }


  async getPowerUsage(range?: string) {
    const { range: resolvedRange, interval, fromSql } = resolveRange(range);

    const rows = await this.prisma.$queryRaw<
      { bucket: Date; power: number }[]
    >`
      SELECT
        date_trunc(${interval}, "timestamp") AS bucket,
        COALESCE(SUM("kwhConsumedAc"), 0) AS power
      FROM "MeterTelemetryHistory"
      WHERE "timestamp" >= ${Prisma.raw(fromSql)}
      GROUP BY bucket
      ORDER BY bucket ASC
    `;

    return {
      range: resolvedRange,
      interval,
      data: rows.map(r => ({
        timestamp: r.bucket.toISOString(),
        powerKw: Number(r.power),
      })),
    };
  }

  async getSessions(range?: string) {
    const { range: resolvedRange, interval, fromSql } = resolveRange(range);

    const rows = await this.prisma.$queryRaw<
      { bucket: Date; sessions: number }[]
    >`
      SELECT
        date_trunc(${interval}, "timestamp") AS bucket,
        COUNT(DISTINCT "vehicleId") AS sessions
      FROM "VehicleTelemetryHistory"
      WHERE "timestamp" >= ${Prisma.raw(fromSql)}
      GROUP BY bucket
      ORDER BY bucket ASC
    `;

    return {
      range: resolvedRange,
      interval,
      data: rows.map(r => ({
        timestamp: r.bucket.toISOString(),
        sessions: Number(r.sessions),
      })),
    };
  }

  async getRecentActivity(range?: string, limit = 20) {
    const { range: resolvedRange, fromSql } = resolveRange(range);

    const rows = await this.prisma.$queryRaw<
      {
        id: string;
        vehicleId: string;
        meterId: string | null;
        timestamp: Date;
      }[]
    >`
      SELECT
        gen_random_uuid()::text AS id,
        "vehicleId",
        NULL AS "meterId", 
        "timestamp"
      FROM "VehicleTelemetryHistory"
      WHERE "timestamp" >= ${Prisma.raw(fromSql)}
      ORDER BY "timestamp" DESC
      LIMIT ${limit}
    `;
    // Need to update the meterId as Null

    return {
      range: resolvedRange,
      events: rows.map(r => ({
        id: r.id,
        type: 'charging_started', // Phase-1 derived
        vehicleId: r.vehicleId,
        meterId: r.meterId,
        timestamp: r.timestamp.toISOString(),
      })),
    };
  }

}
