import {
  DomainEvent,
  DomainEventProps,
} from 'src/lib/domain/domain-event.base';

export class FollowerDeletedDomainEvent extends DomainEvent {
  readonly followerId: string;
  readonly followingId: string;

  constructor(props: DomainEventProps<FollowerDeletedDomainEvent>) {
    super(props);
    this.followerId = props.followerId;
    this.followingId = props.followingId;
  }
}
