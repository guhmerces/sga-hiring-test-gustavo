export interface IDomainEvent {
  dateTimeOccurred: Date;
  // @ts-ignore
  getAggregateId (): string;
}

