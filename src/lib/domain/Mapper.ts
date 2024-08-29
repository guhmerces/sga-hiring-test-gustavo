import { Entity } from "./Entity";

export interface Mapper<
  DomainEntity extends Entity<any>,
  PersistenceModel,
> {
  toPersistence(entity: DomainEntity): PersistenceModel;
  toDomain(raw: any): DomainEntity;
}
