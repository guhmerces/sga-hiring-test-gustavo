
import { ZodIssue } from "zod";
import { Result } from "../logic/Result";
import { UseCaseError } from "./UseCaseError";

export namespace GenericAppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor (err: any) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err
      } as UseCaseError)
    }

    public static create (err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}

export class UnprocessableDataError extends Result<ZodIssue[]> {
  public constructor (issues: any) {
    super(false, issues)
  }

  public static create (issues: any): UnprocessableDataError {
    return new UnprocessableDataError(issues);
  }
}