import {
  DomainEvent,
  DomainEventProps,
} from 'src/lib/domain/domain-event.base';

export class FollowerCreatedDomainEvent extends DomainEvent {
  readonly followerId: string;
  readonly followingId: string;

  constructor(props: DomainEventProps<FollowerCreatedDomainEvent>) {
    super(props);
    this.followerId = props.followerId;
    this.followingId = props.followingId;
  }
}
