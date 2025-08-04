import { getPreviousMonday } from '$lib';
import type { User } from '$lib/config';

import { db, type DBClient } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class DBService {
	private db: DBClient;
	constructor(dbClient: DBClient = db) {
		this.db = dbClient;
	}

	async deletePreset(id: string) {
		return await this.db.delete(table.preset).where(eq(table.preset.id, id)).returning();
	}
	async deleteSession(id: string) {
		return await this.db.delete(table.session).where(eq(table.session.id, id)).returning();
	}
	async deleteBudget(id: number) {
		return await this.db.delete(table.budget).where(eq(table.budget.id, id)).returning();
	}
	async getPresets() {
		return await this.db.select().from(table.preset);
	}
	async getBudgets() {
		return await this.db.select().from(table.budget);
	}
	async getBudgetByDate(date: Date) {
		return await this.db.select({appliesTo: table.budget.appliesTo}).from(table.budget)
			.where(eq(table.budget.appliesTo, getPreviousMonday(date))).limit(1);
	}
	async insertSession(data: { expiresAt: Date; id: string; user: User }) {
		return await this.db.insert(table.session).values(data).returning();
	}
	async insertBudget(data: {amount: string, appliesTo: Date}) {
		return await this.db.insert(table.budget).values(data).returning();
	}
	async insertPreset(data: {amount: string, name: string}) {
		return await this.db.insert(table.preset).values(data).returning();
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
	async updatePreset({ id, ...data }: { amount?: string; id: string; name?: string }) {
		return this.db
			.update(table.preset)
			.set(data)
			.where(eq(table.session.id, id))
			.returning();
	}
	async updateSessionById({ id, ...data }: { expiresAt?: Date; id: string; user?: User }) {
		return this.db
			.update(table.session)
			.set(data)
			.where(eq(table.session.id, id))
			.returning();
	}
	async updateBudget({  id, ...data }: { amount?: string; id: number }) {
		return this.db
			.update(table.budget)
			.set(data)
			.where(eq(table.budget.id, id))
			.returning();
	}
}
