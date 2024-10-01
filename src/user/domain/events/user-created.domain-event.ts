import {
  DomainEvent,
  DomainEventProps,
} from 'src/lib/domain/domain-event.base';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly username: string;
  readonly email: string;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.username = props.username;
    this.email = props.email;
  }
}
