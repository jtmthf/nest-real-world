import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
}
