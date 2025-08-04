import type { User } from '$lib/config';

import { db, type DBClient } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, sql, sum } from 'drizzle-orm';

export class DBService {
	private db: DBClient;
	constructor(dbClient: DBClient = db) {
		this.db = dbClient;
	}

	async deleteBudget(id: string) {
		return await this.db.delete(table.budget).where(eq(table.budget.id, id)).returning();
	}

	async deletePreset(id: string) {
		return await this.db.delete(table.preset).where(eq(table.preset.id, id)).returning();
	}

	async deleteSession(id: string) {
		return await this.db.delete(table.session).where(eq(table.session.id, id)).returning();
	}

	async getBudgetByAppliesTo(appliesTo: Date) {
		return await this.db
			.select({ appliesTo: table.budget.appliesTo })
			.from(table.budget)
			.where(eq(table.budget.appliesTo, appliesTo))
			.limit(1);
	}

	async getPresets() {
		return await this.db.select().from(table.preset);
	}

	async insertBudget(data: { amount: string; appliesTo: Date }) {
		return await this.db.insert(table.budget).values(data).returning();
	}

	async insertPreset(data: { amount: string; name: string }) {
		return await this.db.insert(table.preset).values(data).returning();
	}

	async insertSession(data: { expiresAt: Date; id: string; user: User }) {
		return await this.db.insert(table.session).values(data).returning();
	}

	async insertTransaction(data: {
		amount: string;
		id: string;
		name: string;
		paidAt: Date;
		user: User;
	}) {
		return this.db.insert(table.transaction).values(data).returning();
	}

	async selectAmountSpentPerWeek(timezone: string) {
		const week = sql`${table.transaction.forWeek} AT TIME ZONE '${sql.raw(timezone)}'`.mapWith(
			table.transaction.forWeek
		);

		const result = await db
			.select({
				amount: sum(table.transaction.amount),
				week
			})
			.from(table.transaction)
			.groupBy(week);

		console.log(result);

		return result;
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
				id: table.transaction.id,
				name: table.transaction.name,
				paidAt: table.transaction.paidAt,
				user: table.transaction.user
			})
			.from(table.transaction)
			.where(eq(table.transaction.forWeek, week));
	}

	async updateBudget({ id, ...data }: { amount?: string; id: string }) {
		return this.db.update(table.budget).set(data).where(eq(table.budget.id, id)).returning();
	}

	async updatePreset({ id, ...data }: { amount?: string; id: string; name?: string }) {
		return this.db.update(table.preset).set(data).where(eq(table.session.id, id)).returning();
	}

	async updateSessionById({ id, ...data }: { expiresAt?: Date; id: string; user?: User }) {
		return this.db.update(table.session).set(data).where(eq(table.session.id, id)).returning();
	}
}
