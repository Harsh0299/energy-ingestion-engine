import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';

import { MeterHistoryRepository } from '../history/meter-history.repository';
import { VehicleHistoryRepository } from '../history/vehicle-history.repository';
import { LiveMeterRepository } from '../live-state/live-meter.repository';
import { LiveVehicleRepository } from '../live-state/live-vehicle.repository';

@Injectable()
export class IngestionService {
  constructor(
    private readonly meterHistory: MeterHistoryRepository,
    private readonly vehicleHistory: VehicleHistoryRepository,
    private readonly liveMeter: LiveMeterRepository,
    private readonly liveVehicle: LiveVehicleRepository,
  ) { }

  async process(payload: any) {
    if (payload?.meterId) {
      const dto = plainToInstance(MeterTelemetryDto, payload);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      const timestamp = new Date(dto.timestamp);

      await this.meterHistory.insert({
        meterId: dto.meterId,
        timestamp,
        kwhConsumedAc: dto.kwhConsumedAc,
        voltage: dto.voltage,
      });

      await this.liveMeter.upsert({
        meterId: dto.meterId,
        kwhConsumedAc: dto.kwhConsumedAc,
        voltage: dto.voltage,
        timestamp,
      });

      return { status: 'meter telemetry processed' };
    }

    if (payload?.vehicleId) {
      const dto = plainToInstance(VehicleTelemetryDto, payload);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      const timestamp = new Date(dto.timestamp);

      await this.vehicleHistory.insert({
        vehicleId: dto.vehicleId,
        timestamp,
        soc: dto.soc,
        kwhDeliveredDc: dto.kwhDeliveredDc,
        batteryTemp: dto.batteryTemp,
      });

      await this.liveVehicle.upsert({
        vehicleId: dto.vehicleId,
        soc: dto.soc,
        kwhDeliveredDc: dto.kwhDeliveredDc,
        batteryTemp: dto.batteryTemp,
        timestamp,
      });

      return { status: 'vehicle telemetry processed' };
    }

    throw new BadRequestException('Unknown telemetry payload');
  }
  async get() {
    return { status: 'live meter and vehicle state' };
  }
}
