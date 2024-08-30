import { AggregateRoot } from "src/lib/domain/AggregateRoot";
import { z } from "zod";
import { ArgumentInvalidException } from "src/lib/exceptions/exceptions";

interface TutorialProps {
  title: string;
}

export class Tutorial extends AggregateRoot<TutorialProps> {
  public static create(props: TutorialProps): Tutorial {

    // props validation - avoid invalid state

    const validation = z.object({
      title: z.string().max(255),
    }).safeParse(props)

    if (!validation.success) {
      throw new ArgumentInvalidException(validation.error.message)
    }

    return new Tutorial({
      props: {
        title: validation.data.title,
      }
    })
  }

  public update(props: TutorialProps) {
    // make sure the new props met requirements to build a valid Tutorial
    const newTutorial = Tutorial.create(props);

    // update only allowed attributes
    this.props.title = newTutorial.props.title
  }
}
