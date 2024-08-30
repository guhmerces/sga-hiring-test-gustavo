import { Inject } from "@nestjs/common";
import { TutorialRepoPort } from "src/domain/ports/TutorialRepoPort";
import { Either, Left, left, Result, right } from "src/lib/logic/Result";
import { TUTORIAL_REPO } from "src/tokens";
import { GetTutorialsErros } from "./GetTutorialsErros";
import { GenericAppError } from "src/lib/exceptions/AppError";
import { Tutorial } from "src/domain/Tutorial";
import { ArgumentInvalidException } from "src/lib/exceptions/exceptions";

export type GetTutorialsDto = {
  title: string;
}

type Response = Either<
GenericAppError.UnexpectedError,
  Result<string>
>

export class GetTutorials {
  constructor(
    @Inject(TUTORIAL_REPO)
    protected tutorialRepo: TutorialRepoPort,
  ) { }
  public async execute(dto: GetTutorialsDto): Promise<Response> {

    const { title } = dto;

    try {
      //Check title uniqueness
      const exists = await this.tutorialRepo.exists(title)

      if (!!exists) {
        return left(
          new GetTutorialsErros.TitleAlreadyExists(title)
        )
      }

      const tutorial = Tutorial.create({
        title,
      });

      await this.tutorialRepo.transaction(async () => {
        await this.tutorialRepo.insert(tutorial)
      })

      return right(
        Result.ok(tutorial.id)
      );
    } catch (error: any) {
      switch (error.constructor) {
        case ArgumentInvalidException:
          return left(new GetTutorialsErros.InvalidTutorial(error))
        default:
          return left(new GenericAppError.UnexpectedError(error))
      }
    }
  }
}