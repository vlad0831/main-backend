import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { RiskLevel } from './entities/riskLevel.entity';
import { QueryOrder } from '@mikro-orm/core';

@Injectable()
export class RiskLevelService extends BaseService<RiskLevel> {
  protected readonly logger: Logger;
  constructor(
    @InjectRepository(RiskLevel)
    private readonly riskLevelRepository: EntityRepository<RiskLevel>
  ) {
    super(riskLevelRepository);
    this.logger = new Logger(RiskLevelService.name);
  }

  public getList(): Promise<RiskLevel[]> {
    return this.findAll({ orderBy: { riskLevel: QueryOrder.DESC } });
  }
}
