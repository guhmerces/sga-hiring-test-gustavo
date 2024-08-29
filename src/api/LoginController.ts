import { Body, Controller, ForbiddenException, HttpException, Post, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { routesV1 } from "src/app.routes";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateUserErrors } from "src/application/services/createUser/CreateUserErrors";
import { loginRequestSchema } from "src/application/dtos/schemas";
import openapi from "src/infra/http/openapi";
import { CreateToken } from "src/application/services/createToken/CreateToken";
import { CreateTokenErrors } from "src/application/services/createToken/CreateTokenErrors";

interface LoginDto {
  email: string;
  password: string;
}

@Controller()
export class LoginController {
  constructor(
    protected createToken: CreateToken,
  ) { }
  @ApiOperation(openapi.user.login.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 422, type: UnprocessableEntityException })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @Post(routesV1.user.login)
  public async login(@Body() body: LoginDto): Promise<any> {

    const validation = loginRequestSchema.safeParse(body);

    if (!validation.success) {
      throw new UnprocessableEntityException(validation.error.message)
    }

    const result = await this.createToken.execute(body);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CreateTokenErrors.InvalidCredentials:
          throw new UnauthorizedException(error.errorValue().message)
        default:
          throw new HttpException('Something went wrong', 500);
      }
    }

    return result.value.getValue()
  }
}
