import { Module } from '@nestjs/common';
import { IngestionController } from './injestion.controller';
import { IngestionService } from './injection.service';
import { HistoryModule } from 'src/history/history.module';
import { LiveStateModule } from 'src/live-state/live-state.module';

@Module({
  imports: [HistoryModule, LiveStateModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
