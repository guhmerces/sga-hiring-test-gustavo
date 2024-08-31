require('dotenv').config({ path: '.env' })
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './../../src/boot/db';
import { poolData } from './../../src/config/database.config';
import { v4 } from 'uuid';
import moment from 'moment';

if (!process.env.TEST_DB_DATABASE?.includes('test')) {
  throw new Error(
    `Current database name is: ${process.env.TEST_DB_DATABASE}. Make sure database includes a word "test" as prefix or suffix, for example: "test_db" or "db_test" to avoid writing into a main database.`,
  );
}

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool(poolData),
  }),
});

const tutorials = Array(150).fill(undefined).map((_, i) => createRandomTutorial(i))

export function createRandomTutorial(i) {
  return {
    id: v4(),
    title: 'My awesome tutorial of number ' + i,
    creation_date: i >= 75 ? moment().subtract({ days: 10 }).toDate() : moment().subtract({ days: 5 }).toDate(),
    created_at: new Date(),
    updated_at: new Date()
  };
}

(async () => {
  // if db is not empty, do not seed it
  console.log('if tutorials table is not empty, seed script will not be called')
  const count = await db.selectFrom('tutorials').select('id').execute();
  if (count.length > 0) {
    return
  }
  console.log('Seeding database with some tutorials....')
  await db.insertInto('tutorials').values(tutorials).execute()
})()
