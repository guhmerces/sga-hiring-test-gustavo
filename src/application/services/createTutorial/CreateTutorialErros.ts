import { Result } from "src/lib/logic/Result";
import { UseCaseError } from "src/lib/exceptions/UseCaseError";

export namespace CreateTutorialErros {
  export class TitleAlreadyExists extends Result<UseCaseError> {    
    constructor (title: string) {
      super(false, {
        message: `A tutorial with title ${title} already exists. Please, try again with another title.`
      } as UseCaseError)
    }
  }
}