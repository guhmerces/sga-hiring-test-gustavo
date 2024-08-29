import { BaseRepoPort } from "src/lib/ports/BaseRepoPort";
import { User } from "../User";

export interface UserRepoPort extends BaseRepoPort<User> {
  exists(email: string): Promise<User | false>;
}
