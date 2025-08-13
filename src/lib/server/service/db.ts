import type { User } from '$lib/config';

import { db, type DBClient } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, sql, sum } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export class DBService {
	private db: DBClient;
	constructor(dbClient: DBClient = db) {
		this.db = dbClient;
	}

	async deleteSession(id: string) {
		return await this.db.delete(table.session).where(eq(table.session.id, id)).returning();
	}

	async deleteTransaction(id: string) {
		return await this.db.delete(table.transaction).where(eq(table.transaction.id, id)).returning();
	}

	async insertOrUpdateBudget(data: { amount: string; appliesTo: Date }) {
		return await this.db
			.insert(table.budget)
			.values(data)
			.onConflictDoUpdate({ set: data, target: table.budget.appliesTo })
			.returning();
	}

	async insertSession(data: { expiresAt: Date; id: string; user: User }) {
		return await this.db.insert(table.session).values(data).returning();
	}

	async insertTransaction(data: { amount: string; name: string; paidAt: Date; user: User }) {
		return this.db
			.insert(table.transaction)
			.values({ id: nanoid(), ...data })
			.returning();
	}

	async selectAmountSpentByForWeek({ forWeek, timezone }: { forWeek: Date; timezone: string }) {
		const week = sql`${table.transaction.forWeek} AT TIME ZONE '${sql.raw(timezone)}'`.mapWith(
			table.transaction.forWeek
		);

		const result = await db
			.select({
				amount: sql<string>`COALESCE(${sum(table.transaction.amount)}, '0')`
			})
			.from(table.transaction)
			.groupBy(week)
			.where(eq(table.transaction.forWeek, forWeek))
			.limit(1);

		if (result.length === 0) return undefined;
		return result[0];
	}

	async selectAmountSpentPerWeek(timezone: string) {
		const week = sql`${table.transaction.forWeek} AT TIME ZONE '${sql.raw(timezone)}'`.mapWith(
			table.transaction.forWeek
		);

		const result = await db
			.select({
				amount: sql<string>`COALESCE(${sum(table.transaction.amount)}, '0')`,
				week
			})
			.from(table.transaction)
			.groupBy(week);

		return result;
	}

	async selectBudgetByAppliesTo(appliesTo: Date) {
		const result = await this.db
			.select({
				amount: table.budget.amount,
				id: table.budget.id
			})
			.from(table.budget)
			.where(eq(table.budget.appliesTo, appliesTo))
			.limit(1);

		if (result.length === 0) {
			return undefined;
		}
		return result[0];
	}

	async selectOneSession(id: string) {
		const result = await this.db
			.select({ expiresAt: table.session.expiresAt, user: table.session.user })
			.from(table.session)
			.where(eq(table.session.id, id))
			.limit(1);

		if (result.length === 0) {
			return undefined;
		}

		return result[0];
	}

	async selectTransactionsByForWeek(week: Date) {
		return await this.db
			.select({
				amount: table.transaction.amount,
				forWeek: table.transaction.forWeek,
				id: table.transaction.id,
				name: table.transaction.name,
				paidAt: table.transaction.paidAt,
				user: table.transaction.user
			})
			.from(table.transaction)
			.where(eq(table.transaction.forWeek, week));
	}

	async updateSessionById({ id, ...data }: { expiresAt?: Date; id: string; user?: User }) {
		return this.db.update(table.session).set(data).where(eq(table.session.id, id)).returning();
	}

	async updateTransaction({ id, ...data }: { amount: string; id: string; name: string }) {
		return this.db.update(table.transaction).set(data).where(eq(table.transaction.id, id));
	}
}
