import { Controller, Post, Body, Get } from '@nestjs/common';
import { IngestionService } from './injection.service';

@Controller('ingest')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  async ingest(@Body() payload: any) {
    console.log('payload', payload);
    return this.ingestionService.process(payload);
  }

  @Get()
  async get() {
    return this.ingestionService.get();
  }
}
