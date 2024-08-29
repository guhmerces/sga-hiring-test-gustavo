import { Inject } from "@nestjs/common"
import { UserRepo } from "src/infra/repos/UserRepo"
import { GenericAppError } from "src/lib/exceptions/AppError"
import { Either, left, Result, right } from "src/lib/logic/Result"
import { USER_REPO } from "src/tokens"
import { CreateUserErrors } from "./CreateUserErrors"
import { UserPassword } from "src/domain/UserPassword"
import { User } from "src/domain/User"
import { v4 } from "uuid"
import { UserPort } from "src/domain/ports/UserRepoPort"

type Response = Either<
  GenericAppError.UnexpectedError |
  CreateUserErrors.AccountAlreadyExists,
  Result<string>
>

type CreateUserRequestDto = {
  email: string;
  password: string;
}

export class CreateUser {

  constructor(
    @Inject(USER_REPO)
    protected userRepo: UserPort,
  ) { }

  public async execute(dto: CreateUserRequestDto): Promise<Response> {
    try {
      const exists = await this.userRepo.exists(dto.email)
      if (!exists) {
        return left(
          new CreateUserErrors.AccountAlreadyExists(dto.email)
        )
      }
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error))
    }

    const hashedPassword = UserPassword.create({
      value: await UserPassword.hashPassword(dto.password),
      hashed: true,
    })

    const userId = v4();

    const user = User.create({
      email: dto.email,
      passwordHash: hashedPassword.getValue(),
    }, userId);

    try {
      await this.userRepo.transaction( async() => {
        await this.userRepo.insert(user)
      })

      return right(
        Result.ok(userId)
      );
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error))
    }
  }
}