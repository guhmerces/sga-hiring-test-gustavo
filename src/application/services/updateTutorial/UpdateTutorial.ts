import { Inject } from "@nestjs/common";
import { TutorialRepoPort } from "src/domain/ports/TutorialRepoPort";
import { Either, left, Result, right } from "src/lib/logic/Result";
import { TUTORIAL_REPO } from "src/tokens";
import { DeleteTutorialErros } from "../deleteTutorial/DeleteTutorialErros";

export type UpdateTutorialDto = {
  title: string;
}

type Response = Either<
  DeleteTutorialErros.TutorialNotFound,
  Result<string>
>

export class UpdateTutorial {
  constructor(
    @Inject(TUTORIAL_REPO)
    protected tutorialRepo: TutorialRepoPort,
  ) { }

  public async execute(id: string): Promise<Response> {
    const tutorial = await this.tutorialRepo.findOne(id)

    if (!tutorial) {
      return left(
        new DeleteTutorialErros.TutorialNotFound(id)
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