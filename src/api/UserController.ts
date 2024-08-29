import { Body, Controller, ForbiddenException, HttpException, Post, UnprocessableEntityException } from "@nestjs/common";
import { routesV1 } from "src/app.routes";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SignupUser } from "src/application/services/signupUser/SignupUser";
import { SignupUserErrors } from "src/application/services/signupUser/SignupUserErrors";
import { createUserRequestSchema } from "src/application/dtos/schemas";
import openapi from "src/infra/http/openapi";

interface SignupUserRequestDto {
  email: string;
  password: string;
  passwordConfirmation: string;
}

@Controller()
export class UserController {
  constructor(
    protected signupUser: SignupUser,
  ) { }
  @ApiOperation(openapi.user.signup.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 422, type: UnprocessableEntityException })
  @ApiResponse({ status: 403, type: ForbiddenException })
  @Post(routesV1.user.signup)
  public async create(@Body() body: SignupUserRequestDto): Promise<any> {

    const validation = createUserRequestSchema.safeParse(body);

    if (!validation.success) {
      throw new UnprocessableEntityException(validation.error.message)
    }

    const result = await this.signupUser.execute(body);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case SignupUserErrors.AccountAlreadyExists:
          throw new ForbiddenException(error.errorValue().message)
        default:
          throw new HttpException('Something went wrong', 500);
      }
    }

    return result.value.getValue()
  }
}
