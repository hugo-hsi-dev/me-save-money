import { type SQL, sql } from 'drizzle-orm';
import { date, index, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const session = pgTable('session', {
	expiresAt: timestamp().notNull(),
	id: text().primaryKey(),
	userName: text().notNull()
});

export const transactions = pgTable(
	'transactions',
	{
		amount: numeric({ precision: 12, scale: 2 }).notNull(),
		createdAt: timestamp().defaultNow().notNull(),
		forWeek: date({ mode: 'date' })
			.generatedAlwaysAs((): SQL => sql<Date>`DATE_TRUNC('week', ${transactions.paidAt})`)
			.notNull(),
		id: text().primaryKey(),
		name: text().notNull(),
		paidAt: timestamp().notNull(),
		updatedAt: timestamp().$onUpdate(() => new Date()),
		user: text().notNull()
	},
	(table) => [index('transactions_for_week_idx').on(table.forWeek)]
);

export const presets = pgTable('presets', {
	amount: numeric({ precision: 12, scale: 2 }),
	createdAt: timestamp().defaultNow().notNull(),
	id: text().primaryKey(),
	name: text().notNull(),
	updatedAt: timestamp()
});

export const budget = pgTable('budget', {
	amount: numeric({ precision: 12, scale: 2 }).notNull(),
	appliesTo: date({ mode: 'date' }).notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	id: text().primaryKey(),
	updatedAt: timestamp()
});
