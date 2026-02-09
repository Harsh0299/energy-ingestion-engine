import { Module } from '@nestjs/common';
import { MeterHistoryRepository } from './meter-history.repository';
import { VehicleHistoryRepository } from './vehicle-history.repository';

@Module({
  providers: [
    MeterHistoryRepository,
    VehicleHistoryRepository,
  ],
  exports: [
    MeterHistoryRepository,
    VehicleHistoryRepository,
  ],
})
export class HistoryModule {}
