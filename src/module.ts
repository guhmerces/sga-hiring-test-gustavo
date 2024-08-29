import { Module, Provider } from "@nestjs/common";
import { UserController } from "./api/UserController";
import { CreateUser } from "./application/services/createUser/CreateUser";
import { TUTORIAL_REPO, USER_REPO } from "./tokens";
import { UserMapper } from "./domain/mappers/UserMapper";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { KyselyUserRepo } from "./infra/repos/KyselyUserRepo";
import { ContextInterceptor } from "./lib/application/ContextInterceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { db } from "./boot/db";
import { RequestContextModule } from "nestjs-request-context";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CreateToken } from "./application/services/createToken/CreateToken";
import { LoginController } from "./api/LoginController";
import { CreateTutorial } from "./application/services/createTutorial/CreateTutorial";
import { UpdateTutorial } from "./application/services/updateTutorial/UpdateTutorial";
import { DeleteTutorial } from "./application/services/deleteTutorial/DeleteTutorial";
import { TutorialController } from "./api/TutorialController";
import { KyselyTutorialRepo } from "./infra/repos/KyselyTutorialRepo";
import { TutorialMapper } from "./domain/mappers/TutorialMapper";

const httpControllers = [
  UserController,
  LoginController,

  //Tutorial
  TutorialController
];

const messageControllers = [];

/** Providers */
const commandHandlers: Provider[] = [];

const eventHandlers: Provider[] = []

const mappers: Provider[] = [
  UserMapper,
  TutorialMapper
];

const useCases: Provider[] = [
  CreateUser,
  CreateToken,


  // Tutorial
  CreateTutorial,
  UpdateTutorial,
  DeleteTutorial,
];

const repos: Provider[] = [
  { provide: USER_REPO, useClass: KyselyUserRepo },
  { provide: TUTORIAL_REPO, useClass: KyselyTutorialRepo },
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
export class AppModule { }
