import {
  DomainEvent,
  DomainEventProps,
} from 'src/lib/domain/domain-event.base';

export class UserLoggedInDomainEvent extends DomainEvent {
  readonly email: string;

  constructor(props: DomainEventProps<UserLoggedInDomainEvent>) {
    super(props);
    this.email = props.email;
  }
}
