import { Kysely, PostgresDialect } from "kysely";
import { Database } from "src/boot/db";
import { Pool } from "pg";
import { TestServer, generateTestingApplication } from "./TestServer";
import { redis } from "src/boot/redis";

require('dotenv').config({ path: '.env' })

let pool: Kysely<Database>
let testServer: TestServer

export const TEST_POOL_DATA = {
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_DATABASE,
  port: process.env.TEST_DB_PORT,
  connectionLimit: process.env.TEST_DB_CONNECTIONLIMIT,
};

export function getTestServer(): TestServer {
  return testServer;
}

export function getConnectionPool(): Kysely<Database> {
  return pool;
}

export function getHttpServer() {
  const testServer = getTestServer();
  const httpServer = testServer.serverApplication.getHttpAdapter().getInstance();

  return httpServer;
}

// setup
beforeAll(async() => {
  pool = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(TEST_POOL_DATA),
    }),
  });

  ({ testServer } = await generateTestingApplication())
})

// cleanup
afterAll(async (): Promise<void> => {
  await pool.destroy();
  testServer.serverApplication.close();
  await redis.quit()
});
