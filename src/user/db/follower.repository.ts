import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { and, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/common/drizzle.service';
import { Follower } from '../follower';
import { followers, users } from './user.schema';

@Injectable()
export class FollowerRepository {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async insert(follower: Follower): Promise<Follower> {
    await this.drizzle.db.insert(followers).values(follower.props);

    await follower.publishEvents(this.eventEmitter);
    follower.clearEvents();

    return follower;
  }

  async delete(follower: Follower): Promise<void> {
    await this.drizzle.db
      .delete(followers)
      .where(eq(followers.id, follower.id));

    await follower.publishEvents(this.eventEmitter);
    follower.clearEvents();
  }

  async findByFollowerIdAndFollowingUsername(
    followerId: string,
    followingUsername: string,
  ): Promise<Follower | null> {
    const [result] = await this.drizzle.db
      .select({
        follower: followers,
      })
      .from(followers)
      .innerJoin(users, eq(followers.followingId, users.id))
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(users.username, followingUsername),
        ),
      );

    if (!result) {
      return null;
    }

    const { id, createdAt, updatedAt, ...props } = result.follower;

    return new Follower({
      id: id,
      createdAt,
      updatedAt,
      props,
    });
  }
}
