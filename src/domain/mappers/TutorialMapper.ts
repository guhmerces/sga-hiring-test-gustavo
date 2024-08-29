import { Mapper } from "src/lib/domain/Mapper";
import { RawTutorial } from "src/boot/db";
import { Tutorial } from "../Tutorial";

export class TutorialMapper implements Mapper<Tutorial, RawTutorial> {
  toDomain(rawTutorial: RawTutorial): Tutorial {
    return new Tutorial({
      props: {
        title: rawTutorial.title,
      },
      createdAt: rawTutorial.created_at,
      updatedAt: rawTutorial.updated_at,
    }, rawTutorial.id)
  }

  toPersistence(Tutorial: Tutorial): RawTutorial {
    const props = Tutorial.getProps();

    return {
      id: props.id,
      title: props.title,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      deleted_at: props.deletedAt,
    }
  }
}
