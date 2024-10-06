import { AggregateRoot } from 'src/lib/domain/aggregate-root.base';
import { CreateEntityProps } from 'src/lib/domain/entity.base';
import { FollowerCreatedDomainEvent } from './domain/events/follower-created.domain-event';
import { FollowerDeletedDomainEvent } from './domain/events/follower-deleted.domain-event';

export interface FollowerProps {
  followerId: string;
  followingId: string;
}

export type CreateFollowerProps = CreateEntityProps<string, FollowerProps>;

export class Follower extends AggregateRoot<string, FollowerProps> {
  validate(): void {}

  delete(): void {
    this.addEvent(
      new FollowerDeletedDomainEvent({
        aggregateId: this.id,
        followerId: this.props.followerId,
        followingId: this.props.followingId,
      }),
    );
  }

  static create({
    id,
    props,
    createdAt,
    updatedAt,
  }: CreateFollowerProps): Follower {
    const follower = new Follower({ id, props, createdAt, updatedAt });

    follower.addEvent(
      new FollowerCreatedDomainEvent({
        aggregateId: follower.id,
        followerId: follower.props.followerId,
        followingId: follower.props.followingId,
      }),
    );

    return follower;
  }
}
