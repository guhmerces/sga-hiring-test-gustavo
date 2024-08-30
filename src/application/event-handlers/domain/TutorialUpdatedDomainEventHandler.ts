import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TutorialUpdatedDomainEvent } from "./TutorialUpdatedDomainEvent";

@Injectable()
export class TenantCreatedDomainEventHandler {
  constructor(
    // inject queue / message broker service
  ) {}

  //Integration Events usually should be published only after all Domain Events finished executing and saving all changes to the database.
  @OnEvent(TutorialUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: TutorialUpdatedDomainEvent) {
    // call sqs / rabbitmq
  }
}
