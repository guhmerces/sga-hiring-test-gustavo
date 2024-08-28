import { Mapper } from "../domain/Mapper";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AggregateRoot } from "../domain/AggregateRoot";
import { LoggerPort } from "../ports/ILogger";
import { Kysely, RawBuilder, Transaction, UpdateObject, sql } from "kysely";
import { Database } from "src/boot/db";
import { AppRequestContextService } from "./AppRequestContext";

export interface ObjectLiteral {
  [key: string]: unknown;
}

export abstract class BaseRepo<
  Aggregate extends AggregateRoot<any>,
  PersistenceModel extends ObjectLiteral,
> {
  protected abstract tableName: (keyof Database);

  constructor(
    private readonly _pool: Kysely<Database>,
    protected readonly mapper: Mapper<Aggregate, PersistenceModel>,
    protected readonly eventEmitter: EventEmitter2,
    protected readonly logger: LoggerPort,
    private entities: AggregateRoot<any>[] = [],
  ) { }

  public async transaction<T>(handler: (transaction: Transaction<Database>) => Promise<T>): Promise<T> {
    return this._pool.transaction().execute(async (t) => {

      this.logger.debug(
        `[${AppRequestContextService.getRequestId()}] transaction started`,
      );

      if (!AppRequestContextService.getTransactionConnection()) {
        AppRequestContextService.setTransactionConnection(t);
      }


      try {
        const result = await handler(t);
        await Promise.all(
          this.entities.map((entity) => {
            if (entity instanceof AggregateRoot) {
              return entity.publishEvents(this.logger, this.eventEmitter);
            }
          }),
        );
        this.logger.debug(
          `[${AppRequestContextService.getRequestId()}] transaction committed`,
        );
        return result;
      } catch (e) {
        this.logger.debug(
          `[${AppRequestContextService.getRequestId()}] transaction aborted`,
        );
        throw e;
      } finally {

        AppRequestContextService.cleanTransactionConnection();

      }
    });
  }

  protected async insert(entity: Aggregate | Aggregate[]) {
    const entities = Array.isArray(entity) ? entity : [entity];

    const records = entities.map(entity => {
      let record = this.mapper.toPersistence(entity);

      return record;
    })

    await this.writeQuery(records, this.tableName);

    entities.map((ent) => {
      if (ent instanceof AggregateRoot) {
        this.entities.push(ent);
      }
    });
  }

  protected async destroy(entity: Aggregate, sqlExpression: RawBuilder<any> = sql`1=1`) {
    await this.pool
      .updateTable(this.tableName)
      .set({
        deleted_at: new Date(),
      } as UpdateObject<Database, keyof Database, keyof Database>)
      .where('id', '=', entity.getProps().id)
      .where(sqlExpression)
      .execute()
  }

  protected async findOne<T>(id: string, sqlExpression: RawBuilder<any>): Promise<T> {
    const pool = this.pool;

    //@ts-ignore
    return pool
      .selectFrom(this.tableName)
      .selectAll()
      .where('id', '=', id)
      .where(sqlExpression)
      .executeTakeFirst()
  }

  protected async findAll(sqlExpression: RawBuilder<any>) {
    const pool = this.pool;

    return pool
      .selectFrom(this.tableName)
      .selectAll()
      .where(sqlExpression)
      .execute()
  }
  /**
   * Utility method to generate UPSERT query for any objects.
   * Use carefully and don't accept non-validated objects.
   *
   * Passing object with { id: string, name: string, address: string } will generate
   * a query: INSERT INTO "table" (id, name, email) VALUES ($1, $2, $3) ON CONFLIT (id) SET id = excluded.id, name = excluded.name, address = excluded.address;
   * 
   * Do not use sql.raw method for non-validated inputs
   * In this method, sql.raw() is being used only for known inputs like column and table names
   */
  private generateWriteQuery(persistenceModels: ObjectLiteral[], tableName: string) {

    const columnNames = Object.entries(persistenceModels[0]).map(entry => entry[0]);

    // e.g: id = excluded.id, name = excluded.name, address = excluded.address
    const valuesStatementsForUpdate = columnNames.map((cName) => sql`${sql.raw(cName)} = excluded.${sql.raw(cName)}`)

    // e.g: [[122, "foo", "bar street"],  [331, "bar", "baz street"]]
    let valuesOfEachRow: Array<Array<unknown>> = [];

    persistenceModels.forEach(persistenceModel => {
      const tempValues: unknown[] = [];

      for (const [_, value] of Object.entries(persistenceModel)) {
        tempValues.push(value);
      }

      valuesOfEachRow.push(tempValues)
    })

    // e.g : [($1,$2,$3), ($4,$5,$6)]
    const valuesStatementForInsert = valuesOfEachRow.map(v => sql`(${sql.join(v, sql`,`)})`)

    //                             columns                  row1        row2
    //eg: insert into "users" (id, name, address) values ($1,$2,$3), ($4,$5,$6) ON CONFLICT (id) DO UPDATE SET id = excluded.id, name = excluded.name, address = excluded.address;
    return sql`INSERT INTO ${sql.raw(tableName)} (${sql.raw(columnNames.join(','))}) values ${sql.join(valuesStatementForInsert, sql`,`)} ON CONFLICT (id) DO UPDATE SET ${sql.join(valuesStatementsForUpdate, sql`,`)}`;
  }

  protected async writeQuery(persistenceModels: ObjectLiteral[], table: string) {
    this.logger.debug(
      `[${AppRequestContextService.getRequestId()}] writing ${persistenceModels.length
      } entities to "${table}" table: id ${persistenceModels.map(e => e.id).join(', ')}`,
    );

    const query = this.generateWriteQuery(persistenceModels, table);

    await this.pool.executeQuery(query.compile(this.pool))
  }

  /**
 * Get database pool.
 * If global request transaction is started,
 * returns a transaction pool.
 */
  protected get pool(): Kysely<Database> | Transaction<Database> {
    return (
      AppRequestContextService.getContext().transactionConnection ?? this._pool
    );
  }
}