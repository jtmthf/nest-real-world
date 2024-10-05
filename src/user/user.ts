import { AggregateRoot } from 'src/lib/domain/aggregate-root.base';
import { CreateEntityProps } from 'src/lib/domain/entity.base';
import { UserCreatedDomainEvent } from './domain/events/user-created.domain-event';
import { UserLoggedInDomainEvent } from './domain/events/user-logged-in.event';
import { UserUpdatedDomainEvent } from './domain/events/user-updated.domain.event';

export interface UserProps {
  email: string;
  username: string;
  passwordHash: string;
  bio: string | null;
  image: string | null;
}

export type CreateUserProps = CreateEntityProps<string, UserProps>;
export type UpdateUserProps = Partial<UserProps>;

export class User extends AggregateRoot<string, UserProps> {
  validate(): void {}

  login(): void {
    this.addEvent(
      new UserLoggedInDomainEvent({
        aggregateId: this.id,
        email: this.props.email,
      }),
    );
  }

  update(props: UpdateUserProps): void {
    super.update(props);

    this.addEvent(
      new UserUpdatedDomainEvent({
        aggregateId: this.id,
        username: this.props.username,
        email: this.props.email,
      }),
    );
  }

  static create({ id, props, createdAt, updatedAt }: CreateUserProps): User {
    const user = new User({ id, props, createdAt, updatedAt });

    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: user.id,
        username: user.props.username,
        email: user.props.email,
      }),
    );

    return user;
  }
}
