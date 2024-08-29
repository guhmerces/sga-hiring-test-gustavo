import { InjectOptions } from "fastify";
import { routesV1 } from "src/app.routes";
import { LoginDto } from "src/application/services/createToken/CreateToken";
import { SignupUserRequestDto } from "src/application/services/signupUser/SignupUser";
import { getHttpServer } from "tests/setup/jestSetup";

export class ApiClient {
  async signupUser(dto: SignupUserRequestDto): Promise<string> {
    let reqData: InjectOptions = {
      url: `${routesV1.user.signup}`,
      method: 'POST',
      body: dto,
    }

    const response = await getHttpServer().inject(reqData);
    return response.body;
  }

  async userLogin(dto: LoginDto): Promise<string> {
    let reqData: InjectOptions = {
      url: `${routesV1.user.login}`,
      method: 'POST',
      body: dto,
    }

    const response = await getHttpServer().inject(reqData);
    return response.body;
  }
}
