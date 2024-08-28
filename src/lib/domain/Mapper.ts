import { Entity } from "./Entity";

export interface Mapper<
  DomainEntity extends Entity<any>,
  PersistenceModel,
  ResponseDtoModel = any,
> {
  toPersistence(entity: DomainEntity): PersistenceModel;
  toDomain(record: any): DomainEntity;
  toResponse(entity: DomainEntity): ResponseDtoModel;
}
