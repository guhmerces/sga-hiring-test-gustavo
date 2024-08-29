import { Body, Controller, Delete, ForbiddenException, Get, HttpException, NotFoundException, Patch, Post, UnprocessableEntityException } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { routesV1 } from "src/app.routes";
import { createTutorialSchema } from "src/application/dtos/schemas";
import { CreateTutorial, CreateTutorialDto } from "src/application/services/createTutorial/CreateTutorial";
import { CreateTutorialErros } from "src/application/services/createTutorial/CreateTutorialErros";
import { DeleteTutorial } from "src/application/services/deleteTutorial/DeleteTutorial";
import { UpdateTutorial } from "src/application/services/updateTutorial/UpdateTutorial";
import openapi from "src/infra/http/openapi";

@Controller()
export class TutorialController {
  constructor(
    protected createTutorial: CreateTutorial,
    protected updateTutorial: UpdateTutorial,
    protected deleteTutorial: DeleteTutorial,
  ) { }

  @ApiOperation(openapi.tutorial.create.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 422, type: UnprocessableEntityException })
  @ApiResponse({ status: 403, type: ForbiddenException })
  @Post(routesV1.tutorial.create)
  public async create(@Body() body: CreateTutorialDto): Promise<any> {
    const validation = createTutorialSchema.safeParse(body);

    if (!validation.success) {
      throw new UnprocessableEntityException(validation.error.message)
    }

    const result = await this.createTutorial.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreateTutorialErros.TitleAlreadyExists:
          throw new ForbiddenException(error.errorValue().message)
        case CreateTutorialErros.InvalidTutorial:
          throw new UnprocessableEntityException(error.errorValue().message)
        default:
          throw new HttpException('Something went wrong', 500);
      }
    }

    return result.value.getValue()
  }

  @ApiOperation(openapi.tutorial.update.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 422, type: UnprocessableEntityException, description: 'Invalid data sent to server. A message specifying the errors will be returned' })
  @ApiResponse({ status: 404, type: NotFoundException, description: "There isn't a existing tutorial with this id" })
  @ApiResponse({ status: 403, type: ForbiddenException, description: "The title must be unique" })
  @Patch(routesV1.tutorial.update)
  public async update(@Body() body: CreateTutorialDto): Promise<any> {

  }

  @ApiOperation(openapi.tutorial.delete.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 404, type: NotFoundException })
  @Delete(routesV1.tutorial.delete)
  public async delete(@Body() body: CreateTutorialDto): Promise<any> {

  }

  @ApiOperation(openapi.tutorial.all.schema)
  @ApiResponse({ status: 200, type: String, description: 'Return all tutorials, paginated' })
  @Get(routesV1.tutorial.all)
  public async all(
  ): Promise<any> {

  }
}
