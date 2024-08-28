import { Redis } from "ioredis";

export const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  connectTimeout: 500,
  maxRetriesPerRequest: 1,
});
