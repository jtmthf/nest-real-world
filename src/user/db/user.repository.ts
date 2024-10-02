import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/common/drizzle.service';
import { User } from '../user';
import { users } from './user.schema';

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
      props: {
        ...props,
        bio: props.bio ?? undefined,
        image: props.image ?? undefined,
      },
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
      props: {
        ...props,
        bio: props.bio ?? undefined,
        image: props.image ?? undefined,
      },
    });
  }
}
