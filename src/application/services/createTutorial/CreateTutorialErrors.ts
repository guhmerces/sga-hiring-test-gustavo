import { Result } from "src/lib/logic/Result";
import { UseCaseError } from "src/lib/exceptions/UseCaseError";

export namespace CreateTutorialErrors {
  export class TitleAlreadyExists extends Result<UseCaseError> {    
    constructor (title: string) {
      super(false, {
        message: `A tutorial with title "${title}" already exists. Please, try again with another title.`
      } as UseCaseError)
    }
  }
  export class InvalidTutorial extends Result<UseCaseError> {    
    constructor (errorMessage: string) {
      super(false, {
        message: `There was an error during Tutorial creation : ${errorMessage}`
      } as UseCaseError)
    }
  }
}