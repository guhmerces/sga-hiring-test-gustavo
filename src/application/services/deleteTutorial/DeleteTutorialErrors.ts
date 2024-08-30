import { Result } from "src/lib/logic/Result";
import { UseCaseError } from "src/lib/exceptions/UseCaseError";

export namespace DeleteTutorialErrors {
  export class TutorialNotFound extends Result<UseCaseError> {    
    constructor (id: string) {
      super(false, {
        message: `Tutorial with ${id} not found`
      } as UseCaseError)
    }
  }
}