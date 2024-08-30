import { Inject } from "@nestjs/common";
import { TutorialRepoPort } from "src/domain/ports/TutorialRepoPort";
import { Either, left, Result, right } from "src/lib/logic/Result";
import { TUTORIAL_REPO } from "src/tokens";
import { DeleteTutorialErrors } from "./DeleteTutorialErrors";
import { GenericAppError } from "src/lib/exceptions/AppError";
import { Tutorial } from "src/domain/Tutorial";
import { ArgumentInvalidException } from "src/lib/exceptions/exceptions";

export type DeleteTutorialDto = {
  title: string;
}

type Response = Either<
  DeleteTutorialErrors.TutorialNotFound,
  Result<string>
>

export class DeleteTutorial {
  constructor(
    @Inject(TUTORIAL_REPO)
    protected tutorialRepo: TutorialRepoPort,
  ) { }

  public async execute(id: string): Promise<Response> {
    const tutorial = await this.tutorialRepo.findOne(id)

    if (!tutorial) {
      return left(
        new DeleteTutorialErrors.TutorialNotFound(id)
      )
    }

    await this.tutorialRepo.transaction(async () => {
      await this.tutorialRepo.delete(tutorial)
    })

    return right(
      Result.ok(tutorial.id)
    );
  }
}