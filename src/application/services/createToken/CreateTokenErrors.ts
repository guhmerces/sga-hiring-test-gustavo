import { Result } from "src/lib/logic/Result";
import { UseCaseError } from "src/lib/exceptions/UseCaseError";

export namespace CreateTokenErrors {
  export class InvalidCredentials extends Result<UseCaseError> {    
    constructor () {
      super(false, {
        message: `Invalid Credentials.`
      } as UseCaseError)
    }
  }
}