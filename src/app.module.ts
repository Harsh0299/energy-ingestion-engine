import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { HistoryModule } from './history/history.module';
import { LiveStateModule } from './live-state/live-state.module';

@Module({
  imports: [DatabaseModule, AnalyticsModule, IngestionModule, HistoryModule, LiveStateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
