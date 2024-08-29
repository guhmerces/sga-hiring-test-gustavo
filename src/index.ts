require("dotenv").config();
import { bootstrap } from "./app.bootstrap";
import { AppModule } from "./module";

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

export type NestModule = typeof AppModule;

[
  { instance: AppModule, port: process.env.FASTIFY_SERVER_PORT },
].forEach(module => {
  bootstrap(module.instance, module.port);
})

