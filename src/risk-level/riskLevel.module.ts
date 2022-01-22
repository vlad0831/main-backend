import { Module } from '@nestjs/common';
import { UserRiskLevelService } from './userRiskLevel.service';
import { RiskLevelResolver } from './riskLevel.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RiskLevel } from './entities/riskLevel.entity';
import { UserRiskLevel } from './entities/userRiskLevel.entity';
import { AuthModule } from '../auth/auth.module';
import { RiskLevelService } from './riskLevel.service';

@Module({
  imports: [MikroOrmModule.forFeature([RiskLevel, UserRiskLevel]), AuthModule],
  providers: [RiskLevelService, UserRiskLevelService, RiskLevelResolver],
  exports: [UserRiskLevelService, RiskLevelService],
})
export class RiskLevelModule {}
