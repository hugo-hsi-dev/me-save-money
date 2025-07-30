import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	age: integer('age'),
	id: text('id').primaryKey(),
	passwordHash: text('password_hash').notNull(),
	username: text('username').notNull().unique()
});

export const session = pgTable('session', {
	expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }).notNull(),
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
