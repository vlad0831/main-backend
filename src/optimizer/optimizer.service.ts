import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BadRequestError } from '../shared/errors';

export enum ManagementWorkflowKey {
  auto = 'auto',
  self = 'self',
}

export interface PortfolioOptimizerProps {
  workflow: ManagementWorkflowKey;
  risk_tolerance: number;
  assets?: string[];
  groups?: string[];
  investment_values?: string[];
  run_radar?: boolean;
}

interface OptimizerResponse {
  errors: Record<string, string> | null;
}

export interface OptimizerRecommendedResponse extends OptimizerResponse {
  assets: string[] | null;
  weights: number[] | null;
}

@Injectable()
export class OptimizerService {
  private readonly logger: Logger;
  private readonly optimizerUrl: string;
  public constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const baseUrl = this.configService.get('OPTIMIZER_PORTFOLIO_BASE_URL');
    this.optimizerUrl = `${baseUrl}/optimizer`;
    this.logger = new Logger(OptimizerService.name);
  }

  public async optimizePortfolio(
    props: PortfolioOptimizerProps
  ): Promise<OptimizerRecommendedResponse> {
    const { data }: AxiosResponse<OptimizerRecommendedResponse> =
      await firstValueFrom(
        this.httpService.post(this.optimizerUrl, props).pipe(
          catchError((err) =>
            throwError(() => {
              this.logger.error(
                `Optimizer request error - ${err.response?.data}, code - ${err.response?.code}`
              );
              return new BadRequestError('Optimizer request error', {
                details: err.response?.data,
              });
            })
          )
        )
      );

    if (data.errors && Object.keys(data.errors).length) {
      this.logger.error(`Optimizer error - ${data.errors}`);
      throw new BadRequestError('Optimizer error', {
        details: data.errors,
      });
    }

    if (!data.assets || !data.weights) {
      const errorMessage = 'Portfolio optimization failed - assets or weights are missing';
      this.logger.error(errorMessage);
      throw new BadRequestError(errorMessage);
    }

    return data;
  }
}
