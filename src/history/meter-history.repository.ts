import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MeterHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(event: {
    meterId: string;
    timestamp: Date;
    kwhConsumedAc: number;
    voltage: number;
  }) {
    return this.prisma.meterTelemetryHistory.create({
      data: {
        meterId: event.meterId,
        timestamp: event.timestamp,
        kwhConsumedAc: event.kwhConsumedAc,
        voltage: event.voltage,
      },
    });
  }
}
