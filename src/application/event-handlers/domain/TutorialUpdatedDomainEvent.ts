import { DomainEvent, DomainEventProps } from "src/lib/events/DomainEvent";

export class TutorialUpdatedDomainEvent extends DomainEvent{
  readonly newTitle: string;

  constructor(props: DomainEventProps<TutorialUpdatedDomainEvent>) {
    super(props);
    this.newTitle = props.newTitle
  }
}