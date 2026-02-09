import { Module } from '@nestjs/common';
import { LiveMeterRepository } from './live-meter.repository';
import { LiveVehicleRepository } from './live-vehicle.repository';

@Module({
  providers: [LiveMeterRepository, LiveVehicleRepository],
  exports: [LiveMeterRepository, LiveVehicleRepository],
})
export class LiveStateModule {}
