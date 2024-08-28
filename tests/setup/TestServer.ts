import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModuleBuilder, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/index';

export class TestServer {
  constructor(
    public readonly serverApplication: NestFastifyApplication,
    public readonly testingModule: TestingModule,
  ) {    
  }
  public static async create(
    testingModuleBuilder: TestingModuleBuilder
  ) {
    const testingModule: TestingModule = await testingModuleBuilder.compile();

    const app: NestFastifyApplication = testingModule.createNestApplication(new FastifyAdapter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    return new TestServer(app, testingModule)
  }
}

export async function generateTestingApplication(): Promise<{
  testServer: TestServer;
}> {
  const testServer = await TestServer.create(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  );

  return {
    testServer,
  };
}