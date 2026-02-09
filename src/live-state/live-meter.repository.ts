import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LiveMeterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(event: {
    meterId: string;
    kwhConsumedAc: number;
    voltage: number;
    timestamp: Date;
  }) {
    return this.prisma.liveMeterState.upsert({
      where: { meterId: event.meterId },
      create: {
        meterId: event.meterId,
        totalKwhConsumedAc: event.kwhConsumedAc,
        lastVoltage: event.voltage,
        lastReportedAt: event.timestamp,
      },
      update: {
        totalKwhConsumedAc: {
          increment: event.kwhConsumedAc,
        },
        lastVoltage: event.voltage,
        lastReportedAt: event.timestamp,
        updatedAt: new Date(),
      },
    });
  }
}
