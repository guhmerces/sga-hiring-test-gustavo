import { Module, Provider } from "@nestjs/common";
import { UserController } from "./api/UserController";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ContextInterceptor } from "./lib/application/ContextInterceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { db } from "./boot/db";
import { RequestContextModule } from "nestjs-request-context";
import { EventEmitterModule } from "@nestjs/event-emitter";

const httpControllers = [
  UserController,
];

const messageControllers = [];

/** Providers */
const commandHandlers: Provider[] = [];

const eventHandlers: Provider[] = []

const mappers: Provider[] = [
];

const useCases: Provider[] = [
];

const repos: Provider[] = [
]

const queries: Provider[] = []

const microservices = [
  {
    provide: 'EXAMPLE_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
          queue: 'exampleQueue',
          queueOptions: {
            durable: true,
          },
        },
      })
    }
  },
];

@Module({
  controllers: [...httpControllers],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
    {
      provide: 'DatabasePool',
      useValue: db
    },
    ...repos,
    ...useCases,
    ...queries,
    ...mappers,
    ...microservices,
    ...eventHandlers,
  ],
  imports: [ 
    RequestContextModule,
    EventEmitterModule.forRoot(),
   ]
})
export class AppModule{ }
