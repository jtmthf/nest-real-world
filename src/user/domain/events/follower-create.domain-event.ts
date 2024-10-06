import {
  DomainEvent,
  DomainEventProps,
} from 'src/lib/domain/domain-event.base';

export class FollowerCreateDomainEvent extends DomainEvent {
  readonly followerId: string;
  readonly followingId: string;

  constructor(props: DomainEventProps<FollowerCreateDomainEvent>) {
    super(props);
    this.followerId = props.followerId;
    this.followingId = props.followingId;
  }
}
