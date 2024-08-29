import { Database, db, RawUser } from "src/boot/db";
import { Kysely } from "kysely";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserMapper } from "src/domain/mappers/UserMapper";
import { User } from "src/domain/User";
import { UserRepoPort } from "src/domain/ports/UserRepoPort";
import { KyselyBaseRepo } from "src/lib/infra/KyselyBaseRepo";

@Injectable()
export class KyselyUserRepo extends KyselyBaseRepo<
  User,
  RawUser
> implements UserRepoPort {

  protected tableName = "users";

  constructor(
    @Inject('DatabasePool')
    pool: Kysely<Database>,
    mapper: UserMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(db, mapper, eventEmitter, new Logger(KyselyUserRepo.name));
  }

  async exists(email: string) {
    const rawUser = await this.pool
      .selectFrom('users')
      .select(['email', 'id', 'password_hash', 'created_at', 'updated_at'])
      .where('email', '=', email)
      .executeTakeFirst()

    if(!rawUser) {
      return false;
    }

    return this.mapper.toDomain(rawUser)
  }
}
