import { Mapper } from "src/lib/domain/Mapper";
import { RawTutorial } from "src/boot/db";
import { Tutorial } from "../Tutorial";
import moment from "moment";

export class TutorialMapper implements Mapper<Tutorial, RawTutorial> {
  toDomain(rawTutorial: RawTutorial): Tutorial {
    return new Tutorial({
      props: {
        title: rawTutorial.title,
        creationDate: rawTutorial.creation_date
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
      creation_date: props.creationDate,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      deleted_at: props.deletedAt,
    }
  }

  toAPI(tutorial: Tutorial) {
    return {
      id: tutorial.id,
      title: tutorial.getProps().title,
      creationDate: moment(tutorial.getProps().creationDate).format('DD/MM/YYYY')
    }
  }
}
