import { InjectOptions } from "fastify";
import { routesV1 } from "src/app.routes";
import { LoginDto } from "src/application/services/createToken/CreateToken";
import { CreateTutorialDto } from "src/application/services/createTutorial/CreateTutorial";
import { DeleteTutorialDto } from "src/application/services/deleteTutorial/DeleteTutorial";
import { SignupUserRequestDto } from "src/application/services/signupUser/SignupUser";
import { UpdateTutorialDto } from "src/application/services/updateTutorial/UpdateTutorial";
import { getHttpServer } from "tests/setup/jestSetup";
import { GetAllTutorialsDto } from "tests/steps";

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

  async getTutorials(dto: GetAllTutorialsDto): Promise<string> {
    let reqData: InjectOptions = {
      url: `${routesV1.tutorial.all}`,
      method: 'GET',
      body: dto,
    }

    const response = await getHttpServer().inject(reqData);
    return response.body;
  }

  async createTutorial(dto: CreateTutorialDto): Promise<string> {
    let reqData: InjectOptions = {
      url: `${routesV1.tutorial.create}`,
      method: 'POST',
      body: dto,
    }

    const response = await getHttpServer().inject(reqData);
    return response.body;
  }

  async updateTutorial(dto: UpdateTutorialDto): Promise<string> {
    let reqData: InjectOptions = {
      url: `${routesV1.tutorial.update}`,
      method: 'PATCH',
      body: dto,
    }

    const response = await getHttpServer().inject(reqData);
    return response.body;
  }

  async deleteTutorial(dto: DeleteTutorialDto): Promise<string> {
    let reqData: InjectOptions = {
      url: `${routesV1.tutorial.delete}`,
      method: 'DELETE',
      body: dto,
    }

    const response = await getHttpServer().inject(reqData);
    return response.body;
  }
}
