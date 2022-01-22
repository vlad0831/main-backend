import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ManagedPortfolio } from './entities/managedPortfolio.entity';
import { ManagedPortfolioService } from './managedPortfolio.service';
import { DrivewealthModule } from '../drivewealth/drivewealth.module';
import { OptimizerModule } from '../optimizer/optimizer.module';
import { AllocationNormalizer } from './allocationNormalizer';

@Module({
  imports: [
    MikroOrmModule.forFeature([ManagedPortfolio]),
    DrivewealthModule,
    OptimizerModule,
  ],
  providers: [ManagedPortfolioService, AllocationNormalizer],
  exports: [ManagedPortfolioService],
})
export class ManagedPortfolioModule {}
