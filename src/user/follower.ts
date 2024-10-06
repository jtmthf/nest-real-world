import { AggregateRoot } from 'src/lib/domain/aggregate-root.base';
import { CreateEntityProps } from 'src/lib/domain/entity.base';
import { FollowerCreateDomainEvent } from './domain/events/follower-create.domain-event';

export interface FollowerProps {
  followerId: string;
  followingId: string;
}

export type CreateFollowerProps = CreateEntityProps<string, FollowerProps>;

export class Follower extends AggregateRoot<string, FollowerProps> {
  validate(): void {}

  static create({
    id,
    props,
    createdAt,
    updatedAt,
  }: CreateFollowerProps): Follower {
    const follower = new Follower({ id, props, createdAt, updatedAt });

    follower.addEvent(
      new FollowerCreateDomainEvent({
        aggregateId: follower.id,
        followerId: follower.props.followerId,
        followingId: follower.props.followingId,
      }),
    );

    return follower;
  }
}
