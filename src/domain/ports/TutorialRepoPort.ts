import { BaseRepoPort } from "src/lib/ports/BaseRepoPort";
import { Tutorial } from "../Tutorial";

export interface TutorialRepoPort extends BaseRepoPort<Tutorial> {
  exists(title: string): Promise<Tutorial | false>;
}
