import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { IS_PROD } from './shared/constants';
import { ValidationPipe } from '@nestjs/common';
import { storage } from './shared/utils/loadModule';
import fastifyRawBody from 'fastify-raw-body';

global['fetch'] = require('node-fetch');

async function bootstrap() {
  // get ips behind proxy
  const fastifyAdapter = new FastifyAdapter({ trustProxy: true });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: IS_PROD ? ['warn', 'error'] : ['debug'],
    }
  );

  // get raw body
  await app.register(fastifyRawBody, {
    field: 'rawBody',
    encoding: 'utf8',
    runFirst: true,
    global: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const documentConfig = new DocumentBuilder()
    .setTitle('Main Backend')
    .setDescription('Main Backend of Allio')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, document);

  const fastifyInstance = fastifyAdapter.getInstance();
  const orm = app.get(MikroORM);

  fastifyInstance.addHook(
    'preHandler',
    (request: FastifyRequest, reply: FastifyReply, done) => {
      storage.run(orm.em.fork(true, true), done);
    }
  );

  await app.listen(3000);
}
bootstrap();
