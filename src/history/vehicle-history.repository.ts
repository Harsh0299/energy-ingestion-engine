import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VehicleHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(event: {
    vehicleId: string;
    timestamp: Date;
    soc: number;
    kwhDeliveredDc: number;
    batteryTemp: number;
  }) {
    return this.prisma.vehicleTelemetryHistory.create({
      data: {
        vehicleId: event.vehicleId,
        timestamp: event.timestamp,
        soc: event.soc,
        kwhDeliveredDc: event.kwhDeliveredDc,
        batteryTemp: event.batteryTemp,
      },
    });
  }
}
