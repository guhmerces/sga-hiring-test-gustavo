import { DefineStepFunction } from "jest-cucumber";
import { TestContext } from "tests/test-utils/TestContext";


export function iReceiveAnErrorWithStatusCode<T>(
  then: DefineStepFunction,
  ctx: TestContext<T>,
): void {
  then(
    /^I receive an error "(.*)" with status code (\d+)$/,
    async (errorMessage: string, statusCode: string) => {
      //@ts-ignore
      const apiError: any = JSON.parse(ctx.latestResponse);
      expect(apiError.statusCode).toBe(parseInt(statusCode));
      expect(apiError.error).toBe(errorMessage);
    },
  );
};

export function iReceiveOnlyTheErrorCorrespondingToASpecificAttribute<T>(
  then: DefineStepFunction,
  ctx: TestContext<T>,
): void {
  then(/^I can see only the error related to "(.*)" in the response/,
    async (attributeName: string) => {
      //@ts-ignore
      const apiError: any = JSON.parse(ctx.latestResponse);
      expect(apiError.message.length).toBe(1);
      expect(apiError.message[0].path.includes(attributeName)).toBe(true);
    })
};
