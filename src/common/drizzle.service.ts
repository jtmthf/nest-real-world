import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as userSchema from 'src/user/db/user.schema';

@Injectable()
export class DrizzleService {
  db: PostgresJsDatabase<typeof userSchema>;

  constructor(config: ConfigService) {
    const user = config.get<string>('POSTGRES_USER');
    const password = config.get<string>('POSTGRES_PASSWORD');
    const db = config.get<string>('POSTGRES_DB');

    const client = postgres(
      `postgres://${user}:${password}@0.0.0.0:5432/${db}`,
    );

    this.db = drizzle(client, {
      schema: { ...userSchema },
      logger: true,
    });
  }
}
