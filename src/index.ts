require("dotenv").config();
import { Global, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { APP_INTERCEPTOR, NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { redis } from "./boot/redis";
import fastifyHelmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { RequestContextModule } from "nestjs-request-context";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { db } from "./boot/db";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ContextInterceptor } from "./lib/application/ContextInterceptor";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FASTIFY_SERVER_PORT: number;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_PORT: number;
      DB_CONNECTIONLIMIT: number;
      DB_DATABASE: string;
      CRYPT_HASH: string;
      REDIS_HOST: string;
      REDIS_PORT: number;
    }
  }
}

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
    {
      provide: 'DatabasePool',
      useValue: db
    }
  ],
  imports: [
    RequestContextModule,
    EventEmitterModule.forRoot(),

  ],
  exports: ['DatabasePool']
})
export class AppModule {
  // todo
  configure(consumer: MiddlewareConsumer): void {
  }
}

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      maxParamLength: 500
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
    .setTitle('Hiring Test Documentation')
    .setDescription('Lorem ipsum')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  if(process.env.NODE_ENV !== 'development') {
    app.listen(process.env.FASTIFY_SERVER_PORT, '0.0.0.0');
  }
}

bootstrap();
