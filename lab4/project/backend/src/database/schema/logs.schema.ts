import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const logs = pgTable('logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  method: varchar('method', { length: 10 }).notNull(),
  path: text('path').notNull(),
  statusCode: integer('status_code'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  payload: jsonb('payload'),
  error: text('error'),
  duration: integer('duration'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
