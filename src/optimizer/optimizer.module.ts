import { Module } from '@nestjs/common';
import { OptimizerService } from './optimizer.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OptimizerService],
  exports: [OptimizerService],
})
export class OptimizerModule {}
