import {
  DomainEvent,
  DomainEventProps,
} from 'src/lib/domain/domain-event.base';

export class UserUpdatedDomainEvent extends DomainEvent {
  readonly username: string;
  readonly email: string;

  constructor(props: DomainEventProps<UserUpdatedDomainEvent>) {
    super(props);
    this.username = props.username;
    this.email = props.email;
  }
}
