import { DefineStepFunction } from "jest-cucumber";
import { TestContext } from "./test-utils/TestContext";
import { SignupUserRequestDto } from "src/application/services/signupUser/SignupUser";
import { ApiClient } from "./test-utils/ApiClient";
import { LoginDto } from "src/application/services/createToken/CreateToken";


export type Mutable<T> = {
  -readonly [key in keyof T]: T[key];
};

export type SignupUserTestContext = {
  signupUserRequestDto: Mutable<SignupUserRequestDto>;
};

export type UserLoginTestContext = {
  userLoginRequestDto: Mutable<LoginDto>;
};

export function givenUserProfileData<T>(
  given: DefineStepFunction,
  ctx: TestContext<SignupUserTestContext>,
) {
  given(/^user profile data$/, (table: SignupUserRequestDto[]) => {
    ctx.context.signupUserRequestDto = table[0];
  })
}

export function givenUserLoginData<T>(
  given: DefineStepFunction,
  ctx: TestContext<UserLoginTestContext>,
) {
  given(/^user login data$/, (table: LoginDto[]) => {
    ctx.context.userLoginRequestDto = table[0];
  })
}

export function iSendRequestToCreateAnUser(
  when: DefineStepFunction,
  ctx: TestContext<SignupUserTestContext>,
): void {
  when('I send request to create an User', async () => {
    const response = await new ApiClient().signupUser(ctx.context.signupUserRequestDto)
    console.log('responsee', response)
    ctx.latestResponse = response;
  });
}

export function iSendRequestToGetAnAuthToken(
  when: DefineStepFunction,
  ctx: TestContext<UserLoginTestContext>,
): void {
  when('I send request to get an auth token', async () => {
    const response = await new ApiClient().userLogin(ctx.context.userLoginRequestDto)
    console.log('responsee', response)
    ctx.latestResponse = response;
  });
}

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
