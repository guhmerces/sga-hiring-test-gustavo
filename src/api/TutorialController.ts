import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { Body, Controller, Delete, ForbiddenException, Get, HttpException, Inject, NotFoundException, Param, Patch, Post, Query, Req, UnprocessableEntityException, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Cache } from "cache-manager";
import moment from "moment";
import { routesV1 } from "src/app.routes";
import { createTutorialSchema, getTutorialsQuerySchema, paginatedQuerySchema, updateTutorialSchema } from "src/application/dtos/schemas";
import { CreateTutorial, CreateTutorialDto } from "src/application/services/createTutorial/CreateTutorial";
import { CreateTutorialErrors } from "src/application/services/createTutorial/CreateTutorialErrors";
import { DeleteTutorial } from "src/application/services/deleteTutorial/DeleteTutorial";
import { DeleteTutorialErrors } from "src/application/services/deleteTutorial/DeleteTutorialErrors";
import { GetTutorials } from "src/application/services/getTutorials/GetTutorials";
import { UpdateTutorial, UpdateTutorialDto } from "src/application/services/updateTutorial/UpdateTutorial";
import { TutorialMapper } from "src/domain/mappers/TutorialMapper";
import { Tutorial } from "src/domain/Tutorial";
import openapi from "src/infra/http/openapi";
import { Paginated } from "src/lib/ports/BaseRepoPort";
import { z, ZodError } from "zod";

export type FindTutorialsQueryDto = {
  title?: string;
  creationDate?: Date;
}

export type PaginatedQueryDto = {
  limit?: number;
  page?: number;
}

@Controller()
export class TutorialController {
  constructor(
    protected createTutorial: CreateTutorial,
    protected updateTutorial: UpdateTutorial,
    protected deleteTutorial: DeleteTutorial,
    protected getTutorials: GetTutorials,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
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
        case CreateTutorialErrors.TitleAlreadyExists:
          throw new ForbiddenException(error.errorValue().message)
        case CreateTutorialErrors.InvalidTutorial:
          throw new UnprocessableEntityException(error.errorValue().message)
        default:
          throw new HttpException('Something went wrong', 500);
      }
    }

    return result.value.getValue();
  }

  @ApiOperation(openapi.tutorial.update.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 422, type: UnprocessableEntityException, description: 'Invalid data sent to server. A message specifying the errors will be returned' })
  @ApiResponse({ status: 404, type: NotFoundException, description: "There isn't a existing tutorial with this id" })
  @ApiResponse({ status: 403, type: ForbiddenException, description: "The title must be unique" })
  @Patch(routesV1.tutorial.update)
  public async update(
    @Body() body: UpdateTutorialDto,
    @Param('id') tutorial_id: string
  ): Promise<any> {
    const validation = updateTutorialSchema.safeParse(body);

    if (!validation.success) {
      throw new UnprocessableEntityException(validation.error.message)
    }

    const result = await this.updateTutorial.execute(body, tutorial_id);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreateTutorialErrors.TitleAlreadyExists:
          throw new ForbiddenException(error.errorValue().message)
        case DeleteTutorialErrors.TutorialNotFound:
          throw new NotFoundException(error.errorValue().message)
        case CreateTutorialErrors.InvalidTutorial:
          throw new UnprocessableEntityException(error.errorValue().message)
        default:
          throw new HttpException('Something went wrong', 500);
      }
    }
  }

  @ApiOperation(openapi.tutorial.delete.schema)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 404, type: NotFoundException })
  @Delete(routesV1.tutorial.delete)
  public async delete(
    @Param('id') tutorial_id: string
  ): Promise<any> {
    const result = await this.deleteTutorial.execute(tutorial_id);

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case DeleteTutorialErrors.TutorialNotFound:
          throw new NotFoundException(error.errorValue().message)
        default:
          throw new HttpException('Something went wrong', 500);
      }
    }
  }

  @ApiOperation(openapi.tutorial.all.schema)
  @ApiResponse({ status: 422, type: UnprocessableEntityException, description: 'Invalid params' })
  @ApiResponse({ status: 200, type: String, description: 'Return all tutorials, paginated' })
  @Get(routesV1.tutorial.all)
  public async all(
    @Query() params: FindTutorialsQueryDto & PaginatedQueryDto,
  ): Promise<any> {
    try {
      const validatedParams = getTutorialsQuerySchema.parse(params)

      const cacheKey = JSON.stringify(validatedParams);
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return JSON.parse(cached as string)
      }

      const result = await this.getTutorials.execute({
        ...validatedParams,
        // convert to Js Date type
        creationDate: validatedParams.creationDate ?
          moment(validatedParams.creationDate, 'DD/MM/YYYY').toDate()
          : undefined
      })

      const paginated = result.value.getValue() as Paginated<Tutorial>;

      const resultToBeCached = {
        ...paginated,
        data: paginated.data.map((new TutorialMapper).toAPI)
      }

      await this.cacheManager.set(
        cacheKey,
        JSON.stringify(resultToBeCached)
      )

      return resultToBeCached

    } catch (error: any) {
      switch (error.constructor) {
        case ZodError:
          throw new UnprocessableEntityException(error.issues)
        default:
          throw new HttpException('Something went wrong', 500);
      }
    }
  }
}
