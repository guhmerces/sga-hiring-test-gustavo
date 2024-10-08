import { Inject } from "@nestjs/common";
import { TutorialRepoPort } from "src/domain/ports/TutorialRepoPort";
import { Either, left, Result, right } from "src/lib/logic/Result";
import { TUTORIAL_REPO } from "src/tokens";
import { DeleteTutorialErrors } from "../deleteTutorial/DeleteTutorialErrors";
import { CreateTutorialErrors } from "../createTutorial/CreateTutorialErrors";
import { ArgumentInvalidException } from "src/lib/exceptions/exceptions";
import { GenericAppError } from "src/lib/exceptions/AppError";

export type UpdateTutorialDto = {
  title: string;
}

type Response = Either<
  DeleteTutorialErrors.TutorialNotFound |
  CreateTutorialErrors.TitleAlreadyExists |
  CreateTutorialErrors.InvalidTutorial,
  Result<void>
>

export class UpdateTutorial {
  constructor(
    @Inject(TUTORIAL_REPO)
    protected tutorialRepo: TutorialRepoPort,
  ) { }

  public async execute(dto: UpdateTutorialDto, id: string): Promise<Response> {
    const { title } = dto;

    try {
      // check if tutorial exists
      const tutorial = await this.tutorialRepo.findOne(id)

      if (!tutorial) {
        return left(
          new DeleteTutorialErrors.TutorialNotFound(id)
        )
      }

      // check if new title is unique
      const foundTutorialWithSameTitle = await this.tutorialRepo.exists(title)

      if (
        !!foundTutorialWithSameTitle
        && foundTutorialWithSameTitle.id != tutorial.id
      ) {
        return left(
          new CreateTutorialErrors.TitleAlreadyExists(title)
        )
      }

      // update tutorial
      tutorial.update(dto);

      // save
      await this.tutorialRepo.transaction(async () => {
        await this.tutorialRepo.insert(tutorial)
      })

      return right(
        Result.ok()
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