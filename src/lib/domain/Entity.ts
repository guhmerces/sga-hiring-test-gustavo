
import { v4 } from 'uuid';

export interface BaseEntityProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreateEntityProps<EntityProps> {
  props: EntityProps;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<EntityProps> {
  protected readonly _id: string;
  public readonly props: EntityProps;

  constructor({props, createdAt, updatedAt, deletedAt}: CreateEntityProps<EntityProps> , id?: string) {
    this._id = id ? id : v4();
    this.props = props;
    const now = new Date();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this._deletedAt = deletedAt;
    this.props = props;
  }


  private readonly _createdAt: Date;

  private _updatedAt: Date;

  private _deletedAt?: Date;

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
* Returns entity properties.
* @return {*}  {Props & EntityProps}
* @memberof Entity
*/
  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  public equals(object?: Entity<EntityProps>): boolean {

    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id === object._id;
  }
}