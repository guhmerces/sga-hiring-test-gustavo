import { Database, db, RawTutorial } from "src/boot/db";
import { Kysely } from "kysely";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TutorialMapper } from "src/domain/mappers/TutorialMapper";
import { Tutorial } from "src/domain/Tutorial";
import { TutorialRepoPort } from "src/domain/ports/TutorialRepoPort";
import { KyselyBaseRepo } from "src/lib/infra/KyselyBaseRepo";

@Injectable()
export class KyselyTutorialRepo extends KyselyBaseRepo<
  Tutorial,
  RawTutorial
> implements TutorialRepoPort {

  protected tableName = "tutorials";

  constructor(
    @Inject('DatabasePool')
    pool: Kysely<Database>,
    mapper: TutorialMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(db, mapper, eventEmitter, new Logger(KyselyTutorialRepo.name));
  }

  async exists(title: string) {
    const rawTutorial = await this.pool
      .selectFrom('tutorials')
      .select(['title', 'id', 'created_at', 'updated_at'])
      .where('title', '=', title)
      .executeTakeFirst()

    if(!rawTutorial) {
      return false;
    }

    return this.mapper.toDomain(rawTutorial)
  }
}
