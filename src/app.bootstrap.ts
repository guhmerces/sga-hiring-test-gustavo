import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { redis } from "./boot/redis";
import fastifyHelmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestModule } from ".";

export async function bootstrap(module: NestModule, port: number) {

  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    new FastifyAdapter({
      maxParamLength: 500,
    })
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
      queue: 'exampleQueue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.startAllMicroservices();

  // set headers 
  app.register(fastifyHelmet);

  //cors
  app.register(cors, {
    origin: '*',
    credentials: true,
  });

  // Simple ip-block of 180 calls/minute
  app.register(rateLimit, {
    max: 180,
    timeWindow: 60 * 1000,
    allowList: ['127.0.0.1'],
    redis, // allow distributed services to share state
    addHeadersOnExceeding: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
    },
    addHeaders: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
      "retry-after": true,
    },
  });


  const config = new DocumentBuilder()
    .setTitle('SGA Hiring Test Documentation')
    .setDescription('Hiring test')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  if(process.env.NODE_ENV !== 'development') {
    app.listen(port, '0.0.0.0');
  }
}
