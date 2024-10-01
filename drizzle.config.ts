import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const db = process.env.POSTGRES_DB;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/*/db/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: `postgres://${user}:${password}@0.0.0.0:5432/${db}`,
  },
});
