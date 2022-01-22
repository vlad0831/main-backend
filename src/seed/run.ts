import { NestFactory } from '@nestjs/core';
import { DatabaseSeeder } from './databaseSeeder';
import { Logger } from '@nestjs/common';
import { SeederModule } from './seeder.module';

async function run() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(SeederModule);
  try {
    const seeder = await app.get<DatabaseSeeder>(DatabaseSeeder);
    await seeder.run();
  } catch (e) {
    logger.error(e);
  }
  await app.close();
}

run();
