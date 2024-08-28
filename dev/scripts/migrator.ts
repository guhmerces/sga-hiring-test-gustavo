require('dotenv').config({ path: '.env' })
import * as path from "path";
import { Kysely, Migrator, FileMigrationProvider, PostgresDialect } from "kysely";
import { Database } from "src/boot/db";
import { Pool } from "pg";
import { promises as fs } from "fs";
import { poolData } from "../../src/config/database.config";

async function migrateToLatest() {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(poolData),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "../migrations"),
    }),
  });

  let results, error;

  if(process.env.MIGRATE === 'DOWN') {
    const r = await migrator.migrateDown();
    results = r.results
    error = r.error
  } else {
    const r = await migrator.migrateToLatest();
    results = r.results
    error = r.error
  }


  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
