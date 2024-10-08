import { Kysely, sql } from "kysely";
import { Database } from "src/boot/db";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("tutorials")
    .addColumn('id', 'varchar(36)', (col) => col.notNull().primaryKey())
    .addColumn('order', 'serial', (col) => col.notNull())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("creation_date", "date", (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP `))
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deleted_at', 'timestamp', (col) => col.defaultTo(sql`NULL`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("tutorials").execute();
}
