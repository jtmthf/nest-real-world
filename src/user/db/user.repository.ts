import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { and, eq, sql } from 'drizzle-orm';
import { PgSelect } from 'drizzle-orm/pg-core';
import { DrizzleService } from 'src/common/drizzle.service';
import { Profile } from '../domain/value-objects/profile.value-object';
import { User } from '../user';
import { followers, users } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async insert(user: User): Promise<User> {
    await this.drizzle.db.insert(users).values(user.props);

    await user.publishEvents(this.eventEmitter);
    user.clearEvents();

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();

    if (!result) {
      return null;
    }

    const { createdAt, updatedAt, ...props } = result;

    return new User({
      id,
      createdAt,
      updatedAt,
      props,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (!result) {
      return null;
    }

    const { id, createdAt, updatedAt, ...props } = result;

    return new User({
      id,
      createdAt,
      updatedAt,
      props,
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .execute();

    if (!result) {
      return null;
    }

    const { id, createdAt, updatedAt, ...props } = result;

    return new User({
      id,
      createdAt,
      updatedAt,
      props,
    });
  }

  async update(user: User): Promise<User> {
    await this.drizzle.db
      .update(users)
      .set(user.props)
      .where(eq(users.id, user.id))
      .execute();

    await user.publishEvents(this.eventEmitter);
    user.clearEvents();

    return user;
  }

  async findProfileByUsername(
    username: string,
    userId?: string,
  ): Promise<Profile | null> {
    function withFollower<T extends PgSelect>(qb: T) {
      return qb.leftJoin(
        followers,
        and(
          eq(users.id, followers.followingId),
          eq(followers.followerId, userId!),
        ),
      );
    }

    let query = this.drizzle.db
      .select({
        username: users.username,
        bio: users.bio,
        image: users.image,
        following: userId
          ? sql`CASE WHEN ${followers.followerId} IS NULL THEN FALSE ELSE TRUE END`.mapWith(
              Boolean,
            )
          : sql`FALSE`.mapWith(Boolean),
      })
      .from(users)
      .where(eq(users.username, username))
      .$dynamic();

    if (userId) {
      query = withFollower(query);
    }

    const [result] = await query.execute();

    return result ?? null;
  }
}
