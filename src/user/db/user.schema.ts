import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  bio: text('bio'),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const followers = pgTable(
  'followers',
  {
    id: uuid('id').primaryKey(),
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    unq: unique().on(table.followerId, table.followingId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  followers: many(followers, { relationName: 'followed' }),
  following: many(followers, { relationName: 'follows' }),
}));

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.id],
    relationName: 'follows',
  }),
  following: one(users, {
    fields: [followers.followingId],
    references: [users.id],
    relationName: 'followed',
  }),
}));
