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
	async getPresets() {
		return await this.db.select().from(table.preset);
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

	async updatePreset({ amount, id, name }: { amount?: string; id: string; name?: string }) {
		return this.db
			.update(table.preset)
			.set({ amount, name })
			.where(eq(table.session.id, id))
			.returning();
	}
	async updateSessionById({ expiresAt, id, user }: { expiresAt?: Date; id: string; user?: User }) {
		return this.db
			.update(table.session)
			.set({ expiresAt, user })
			.where(eq(table.session.id, id))
			.returning();
	}
}
