import { Result } from "src/lib/logic/Result";
import * as bcrypt from 'bcrypt';
import { ValueObject } from "src/lib/domain/ValueObject";

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  
  get value (): string {
    return this.props.value;
  }

  private constructor (props: UserPasswordProps) {
    super(props)
  }

    /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

  public async comparePassword (plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private bcryptCompare (plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      })
    })
  }

  public isAlreadyHashed (): boolean | undefined {
    return this.props.hashed;
  }
  
  public static async hashPassword (password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  public async getHashedValue (): Promise<string> {
    if (this.isAlreadyHashed()) {
        return this.props.value
      } else {
        return UserPassword.hashPassword(this.props.value)
      }
  }

  public static isAppropriateLength (value: string): boolean {
    return value.length >= 6;
  }

  public static create (props: UserPasswordProps): Result<UserPassword> {

    /*
    if (!props.hashed) {
      if (!this.isAppropriateLength(props.value)
      ) {
        return Result.fail<UserPassword>('Password doesnt meet criteria [1 uppercase, 1 lowercase, one digit or symbol and 8 chars min].');
      }
    }
    */
    return Result.ok<UserPassword>(new UserPassword({
      value: props.value,
      hashed: !!props.hashed === true
    }));
  }
}