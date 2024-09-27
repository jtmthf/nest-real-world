import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

@Injectable()
export class DrizzleService {
  db: ReturnType<typeof drizzle>;

  constructor(config: ConfigService) {
    const user = config.get<string>('POSTGRES_USER');
    const password = config.get<string>('POSTGRES_PASSWORD');
    const db = config.get<string>('POSTGRES_DB');

    const client = postgres(
      `postgres://${user}:${password}@0.0.0.0:5432/${db}`,
    );

    this.db = drizzle(client);
  }
}
