import { Database, db, jsonArrayFrom, jsonObjectFrom, RawUser } from "src/boot/db";
import { Kysely } from "kysely";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { BaseRepo } from "src/lib/application/BaseRepo";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserMapper } from "src/domain/mappers/UserMapper";
import { User } from "src/domain/User";

@Injectable()
export class UserRepo extends BaseRepo<
  User,
  RawUser
> {

  protected tableName = "users" as keyof Database;

  constructor(
    @Inject('DatabasePool')
    pool: Kysely<Database>,
    mapper: UserMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(db, mapper, eventEmitter, new Logger(UserRepo.name));
  }

  async exists(email: string) {
    const rawUser = await this.pool
      .selectFrom('users')
      .select(['email', 'id', 'password_hash', 'created_at', 'updated_at'])
      .where('email', '=', email)
      .executeTakeFirst()

    if(!rawUser) {
      return undefined;
    }

    return this.mapper.toDomain(rawUser)
  }
}
