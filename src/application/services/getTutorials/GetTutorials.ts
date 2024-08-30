import { Inject } from "@nestjs/common";
import { TutorialRepoPort } from "src/domain/ports/TutorialRepoPort";
import { Either, Left, left, Result, right } from "src/lib/logic/Result";
import { TUTORIAL_REPO } from "src/tokens";
import { GenericAppError } from "src/lib/exceptions/AppError";
import { Tutorial } from "src/domain/Tutorial";
import { Paginated, SQLQueryFilters } from "src/lib/ports/BaseRepoPort";
import { PaginatedDto } from "src/shared-types";
import moment from "moment";

export type FindTutorialsDto = {
  title?: string;
  creationDate?: Date;
}

type Response = Either<
  GenericAppError.UnexpectedError,
  Result<Paginated<Tutorial>
  >
>

export class GetTutorials {
  constructor(
    @Inject(TUTORIAL_REPO)
    protected tutorialRepo: TutorialRepoPort,
  ) { }

  //@ts-ignore
  public async execute(dto: FindTutorialsDto & PaginatedDto): Promise<Response> {
    try {

      const sqlQueryFilters: SQLQueryFilters[] = []

      if (dto.creationDate) {
        sqlQueryFilters.push({ field: 'creation_date', value: moment(dto.creationDate).format('YYYY-MM-DD') });
      }

      if (dto.title) {
        sqlQueryFilters.push({ field: 'title', value: dto.title })
      }

      const paginated = await this.tutorialRepo.findAllPaginated({
        limit: dto.limit,
        page: dto.page,
        offset: dto.offset,
        sqlQueryFilters,
        orderBy: [{
          field: 'order',
          param: 'asc'
        }]
      })

      return right(
        Result.ok(paginated)
      )
    } catch (error: any) {
      switch (error.constructor) {
        default:
          return left(new GenericAppError.UnexpectedError(error))
      }
    }
  }
}