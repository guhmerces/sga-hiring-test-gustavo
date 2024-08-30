import { DefineStepFunction } from "jest-cucumber";
import { TestContext } from "./test-utils/TestContext";
import { SignupUserRequestDto } from "src/application/services/signupUser/SignupUser";
import { ApiClient } from "./test-utils/ApiClient";
import { LoginDto } from "src/application/services/createToken/CreateToken";
import { CreateTutorialDto } from "src/application/services/createTutorial/CreateTutorial";
import { UpdateTutorialDto } from "src/application/services/updateTutorial/UpdateTutorial";
import { DeleteTutorialDto } from "src/application/services/deleteTutorial/DeleteTutorial";


export type Mutable<T> = {
  -readonly [key in keyof T]: T[key];
};

export type SignupUserTestContext = {
  signupUserRequestDto: Mutable<SignupUserRequestDto>;
};

export type UserLoginTestContext = {
  userLoginRequestDto: Mutable<LoginDto>;
};

export type CreateTutorialTestContext = {
  createTutorialDto: Mutable<CreateTutorialDto>;
};

export type UpdateTutorialTestContext = {
  updateTutorialDto: Mutable<UpdateTutorialDto>;
};

export type DeleteTutorialTestContext = {
  deleteTutorialDto: Mutable<DeleteTutorialDto>;
};


export type GetAllTutorialsDto = {}
export type GetAllTutorialsTestContext = {
  getAllTutorialsDto: Mutable<GetAllTutorialsDto>;
};


// User and user auth tokens
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

// Tutorial
export function givenTutorialData<T>(
  given: DefineStepFunction,
  ctx: TestContext<CreateTutorialTestContext>,
) {
  given(/^tutorial data$/, (table: CreateTutorialDto[]) => {
    ctx.context.createTutorialDto = table[0];
  })
}

export function iSendRequestToCreateATutorial(
  when: DefineStepFunction,
  ctx: TestContext<CreateTutorialTestContext>,
): void {
  when('I send request to create a Tutorial', async () => {
    const response = await new ApiClient().createTutorial(ctx.context.createTutorialDto)
    console.log('responsee', response)
    ctx.latestResponse = response;
  });
}

export function iSendRequestToUpdateATutorial(
  when: DefineStepFunction,
  ctx: TestContext<UpdateTutorialTestContext>,
): void {
  when('I send request to update a Tutorial', async () => {
    const response = await new ApiClient().updateTutorial(ctx.context.updateTutorialDto)
    console.log('responsee', response)
    ctx.latestResponse = response;
  });
}

export function iSendRequestToDeleteATutorial(
  when: DefineStepFunction,
  ctx: TestContext<DeleteTutorialTestContext>,
): void {
  when('I send request to delete a Tutorial', async () => {
    const response = await new ApiClient().deleteTutorial(ctx.context.deleteTutorialDto)
    console.log('responsee', response)
    ctx.latestResponse = response;
  });
}

export function iSendRequestToGetAllATutorials(
  when: DefineStepFunction,
  ctx: TestContext<GetAllTutorialsTestContext>,
): void {
  when('I send request to delete a Tutorial', async () => {
    const response = await new ApiClient().getTutorials(ctx.context.getAllTutorialsDto)
    console.log('responsee', response)
    ctx.latestResponse = response;
  });
}


//Shared
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
