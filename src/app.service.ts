import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DrizzleService } from './common/drizzle.service';

@Injectable()
export class AppService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getHello(): Promise<string> {
    const result = await this.drizzle.db.execute<{
      message: string;
    }>(sql`SELECT 'Hello, World!' AS message`);

    return result[0].message;
  }
}
