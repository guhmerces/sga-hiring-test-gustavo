import { Mapper } from "src/lib/domain/Mapper";
import { RawUser } from "src/boot/db";
import { User } from "../User";
import { UserPassword } from "../UserPassword";

export class UserMapper implements Mapper<User, RawUser> {
  toDomain(rawUser: RawUser): User {
    return new User({
      props: {
        email: rawUser.email,
        passwordHash: UserPassword.create({ value: rawUser.password_hash, hashed: true }).getValue(),
      },
      createdAt: rawUser.created_at,
      updatedAt: rawUser.updated_at,
    }, rawUser.id)
  }

  toPersistence(user: User): RawUser {
    const props = user.getProps();

    return {
      id: props.id,
      password_hash: props.passwordHash.value,
      email: props.email,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      deleted_at: props.deletedAt,
    }
  }
}
