import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../../mikro-orm.config';
import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import loadSecret from '../../config/loadSecret';
import loadEnv from '../../config/loadEnv';
import { DynamicModule } from '@nestjs/common';

export const storage = new AsyncLocalStorage<EntityManager>();

export function loadMikroOrmModule(): DynamicModule {
  return MikroOrmModule.forRoot({
    ...config,
    registerRequestContext: false,
    context: () => storage.getStore(),
  });
}

export function loadConfigModule(): DynamicModule {
  return ConfigModule.forRoot({
    load: [loadSecret('secrets'), loadEnv],
    isGlobal: true,
    cache: true,
  });
}
