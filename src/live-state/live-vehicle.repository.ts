import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LiveVehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(event: {
    vehicleId: string;
    soc: number;
    kwhDeliveredDc: number;
    batteryTemp: number;
    timestamp: Date;
  }) {
    return this.prisma.liveVehicleState.upsert({
      where: { vehicleId: event.vehicleId },
      create: {
        vehicleId: event.vehicleId,
        soc: event.soc,
        totalKwhDeliveredDc: event.kwhDeliveredDc,
        avgBatteryTemp: event.batteryTemp,
        lastReportedAt: event.timestamp,
      },
      update: {
        soc: event.soc,
        totalKwhDeliveredDc: {
          increment: event.kwhDeliveredDc,
        },
        avgBatteryTemp: event.batteryTemp,
        lastReportedAt: event.timestamp,
        updatedAt: new Date(),
      },
    });
  }
}
