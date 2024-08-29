import { AggregateRoot } from "src/lib/domain/AggregateRoot";
import { UserPassword } from "./UserPassword";
import { z } from "zod";
import { ArgumentInvalidException } from "src/lib/exceptions/exceptions";

interface UserProps {
  email: string;
  passwordHash: UserPassword;
}

export class User extends AggregateRoot<UserProps>{
  public static create(props: UserProps, id?: string): User {

    // props validation - avoid invalid state

    const validation = z.object({
      email: z.string().email({ message: 'invalid email'}),
      passwordHash: z.string()
    }).safeParse(props)

    if(!validation.success) {
      throw new ArgumentInvalidException(validation.error.message)
    }

    return new User({
      props: {
        email: validation.data.email,
        passwordHash: UserPassword.create({ value: validation.data.passwordHash}).getValue()
      }
    })
  }
}
