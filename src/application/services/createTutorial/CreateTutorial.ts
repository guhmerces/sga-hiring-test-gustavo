import { Inject } from "@nestjs/common";
import { TutorialRepoPort } from "src/domain/ports/TutorialRepoPort";
import { Either, Left, left, Result, right } from "src/lib/logic/Result";
import { TUTORIAL_REPO } from "src/tokens";
import { CreateTutorialErrors } from "./CreateTutorialErrors";
import { GenericAppError } from "src/lib/exceptions/AppError";
import { Tutorial } from "src/domain/Tutorial";
import { ArgumentInvalidException } from "src/lib/exceptions/exceptions";

export type CreateTutorialDto = {
  title: string;
}

type Response = Either<
  CreateTutorialErrors.TitleAlreadyExists |
  CreateTutorialErrors.InvalidTutorial,
  Result<string>
>

export class CreateTutorial {
  constructor(
    @Inject(TUTORIAL_REPO)
    protected tutorialRepo: TutorialRepoPort,
  ) { }
  public async execute(dto: CreateTutorialDto): Promise<Response> {

    const { title } = dto;

    try {
      //Check title uniqueness
      const exists = await this.tutorialRepo.exists(title)

      if (!!exists) {
        return left(
          new CreateTutorialErrors.TitleAlreadyExists(title)
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
          return left(new CreateTutorialErrors.InvalidTutorial(error))
        default:
          return left(new GenericAppError.UnexpectedError(error))
      }
    }
  }
}