import { AggregateRoot } from 'src/lib/domain/aggregate-root.base';
import { CreateEntityProps } from 'src/lib/domain/entity.base';
import { UserCreatedDomainEvent } from './domain/events/user-created.domain-event';

export interface UserProps {
  email: string;
  username: string;
  passwordHash: string;
  bio?: string;
  image?: string;
}

export type CreateUserProps = CreateEntityProps<string, UserProps>;

export class User extends AggregateRoot<string, UserProps> {
  validate(): void {}

  static create({ id, props, createdAt, updatedAt }: CreateUserProps): User {
    const user = new User({ id, props, createdAt, updatedAt });

    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: user.id.toString(),
        username: user.props.username,
        email: user.props.email,
      }),
    );

    return user;
  }
}
