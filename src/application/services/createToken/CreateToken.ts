import { Inject } from "@nestjs/common"
import { GenericAppError } from "src/lib/exceptions/AppError"
import { Either, left, Result, right } from "src/lib/logic/Result"
import { USER_REPO } from "src/tokens"
import { UserRepoPort } from "src/domain/ports/UserRepoPort"
import { CreateTokenErrors } from "./CreateTokenErrors"
import jose from 'node-jose'
import keyset from 'jwk.json'
import { User } from "src/domain/User"

type Response = Either<
  GenericAppError.UnexpectedError | 
  CreateTokenErrors.InvalidCredentials,
  Result<string>
>

type LoginDto = {
  email: string;
  password: string;
}

export class CreateToken {

  constructor(
    @Inject(USER_REPO)
    protected userRepo: UserRepoPort,
  ) { }

  //@ts-ignore
  public async execute(dto: LoginDto): Promise<Response> {
    const { email, password } = dto;

    try {
      const exists = await this.userRepo.exists(email)
      if (exists === false) {
        return left(
          new CreateTokenErrors.InvalidCredentials()
        )
      }

      const user = exists;

      const doesPasswordAndHashMatch = await user.getProps().passwordHash.comparePassword(password)

      if (doesPasswordAndHashMatch === false) {
        return left(
          new CreateTokenErrors.InvalidCredentials()
        )
      }

      const jwt = await this.assembleJWT(user);

      return right(
        Result.ok(jwt)
      )

    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error))
    }
  }

  private async assembleJWT(user: User) {
    const keystore = await jose.JWK.asKeyStore(keyset);

    const currentTime = Math.floor(Date.now() / 1000)
    const expiration = 3600;

    const JWS = jose.JWS.createSign({
      algorithm: 'RSA512',
      format: 'compact'
    },
      keystore.get('174f53f3-d4c4-476b-9e08-f60477248819')
    )
      .update(
        Buffer.from(
          JSON.stringify({
            sub: user.id,
            aud: user.id,
            iat: currentTime,
            exp: currentTime + expiration,
          })
        )
      )
      .final()

    return JWS
  }
}