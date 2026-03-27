import {
  uuid,
  varchar,
  boolean,
  pgTable,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  fullName: varchar('fullName', { length: 255 }),
  avatarUrl: text('avatar_url'),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
