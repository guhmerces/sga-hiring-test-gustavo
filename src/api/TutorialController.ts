import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Patch, Post, UnprocessableEntityException } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { routesV1 } from "src/app.routes";
import { CreateTutorial } from "src/application/services/createTutorial/CreateTutorial";
import { DeleteTutorial } from "src/application/services/deleteTutorial/DeleteTutorial";
import { UpdateTutorial } from "src/application/services/updateTutorial/UpdateTutorial";
import openapi from "src/infra/http/openapi";

type CreateTutorialDto = {

}

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

  }

  @ApiOperation(openapi.tutorial.update.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 422, type: UnprocessableEntityException })
  @ApiResponse({ status: 404, type: NotFoundException })
  @ApiResponse({ status: 403, type: ForbiddenException })
  @Patch(routesV1.tutorial.update)
  public async update(@Body() body: CreateTutorialDto): Promise<any> {

  }

  @ApiOperation(openapi.tutorial.delete.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 422, type: UnprocessableEntityException })
  @ApiResponse({ status: 404, type: NotFoundException })
  @ApiResponse({ status: 403, type: ForbiddenException })
  @Delete(routesV1.tutorial.delete)
  public async delete(@Body() body: CreateTutorialDto): Promise<any> {

  }

  @ApiOperation(openapi.tutorial.all.schema)
  @ApiResponse({ status: 200, type: String, description: 'Get all users' })
  @Get(routesV1.tutorial.all)
  public async all(
  ): Promise<any> {

  }
}
