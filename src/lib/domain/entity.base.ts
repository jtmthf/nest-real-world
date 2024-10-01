export type AggregateID = string | number | bigint;

export interface BaseEntityProps<ID extends AggregateID> {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityProps<ID extends AggregateID, TProps> {
  id: ID;
  props: TProps;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<ID extends AggregateID, Props> {
  #id: ID;
  #props: Props;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    id,
    props,
    createdAt,
    updatedAt,
  }: CreateEntityProps<ID, Props>) {
    const now = new Date();
    this.#id = id;
    this.#props = props;
    this.#createdAt = createdAt ?? now;
    this.#updatedAt = updatedAt ?? now;
    this.validate();
  }

  abstract validate(): void;

  get id(): ID {
    return this.#id;
  }

  get props(): Props & BaseEntityProps<ID> {
    return Object.freeze({
      ...this.#props,
      id: this.#id,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    });
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  update(props: Partial<Props>): void {
    this.#props = { ...this.#props, ...props };
    this.#updatedAt = new Date();
    this.validate();
  }

  isEntity(entity: unknown): entity is Entity<ID, Props> {
    return entity instanceof Entity;
  }

  equals(entity: Entity<ID, Props>): boolean {
    if (entity == null) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!this.isEntity(entity)) {
      return false;
    }

    return this.#id === entity.id;
  }
}
