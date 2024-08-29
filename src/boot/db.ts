import {
  Kysely,
  PostgresDialect,
  ParseJSONResultsPlugin,
} from "kysely";
import {Pool} from 'pg';
import { poolData } from "src/config/database.config";

export type RawUser = {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type RawTutorial = {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Database {
  users: RawUser,
  tutorials: RawTutorial,
}

const dialect = new PostgresDialect({
  pool: new Pool(poolData),
});


export const db = new Kysely<Database>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()],
  log: ['error']
});
