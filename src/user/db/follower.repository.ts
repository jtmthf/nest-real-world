import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DrizzleService } from 'src/common/drizzle.service';
import { Follower } from '../follower';
import { followers } from './user.schema';

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
}
