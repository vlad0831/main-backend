import { Options } from '@mikro-orm/core';
import { IS_PROD } from './shared/constants';
import { Logger } from '@nestjs/common';

const logger = new Logger('Mikro-ORM');

const config = {
  forceUtcTimezone: true,
  forceUndefined: true,
  type: 'postgresql',
  autoLoadEntities: true,
  debug: !IS_PROD,
  logger: logger.debug.bind(logger),
} as Options;

export default config;
