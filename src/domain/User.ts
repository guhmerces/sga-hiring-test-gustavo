import { AggregateRoot } from "src/lib/domain/AggregateRoot";
import { UserPassword } from "./UserPassword";
import { z } from "zod";
import { ArgumentInvalidException } from "src/lib/exceptions/exceptions";

interface UserProps {
  email: string;
  passwordHash: UserPassword;
}

export class User extends AggregateRoot<UserProps> {
  public static create(props: UserProps): User {

    // props validation - avoid invalid state

    const validation = z.object({
      email: z.string().email({ message: 'invalid email' }),
    }).safeParse(props)

    if (!validation.success) {
      throw new ArgumentInvalidException(validation.error.message)
    }

    if (!(props.passwordHash instanceof UserPassword)) {
      throw new ArgumentInvalidException('The atribute passwordHash should be a instance of UserPassword')
    }

    return new User({
      props: {
        email: validation.data.email,
        passwordHash: props.passwordHash
      }
    })
  }
}
