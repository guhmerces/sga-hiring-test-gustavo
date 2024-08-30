import { Result } from "src/lib/logic/Result";
import { UseCaseError } from "src/lib/exceptions/UseCaseError";

export namespace SignupUserErrors {
  export class AccountAlreadyExists extends Result<UseCaseError> {    
    constructor (email: string) {
      super(false, {
        message: `The email ${email} is already registered.`
      } as UseCaseError)
    }
  }
}