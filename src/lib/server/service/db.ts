import type { User } from '$lib/config';

import { DATABASE_URL } from '$env/static/private';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { drizzle, type NodePgClient, NodePgDatabase } from 'drizzle-orm/node-postgres';

type DBClient = {
	$client: NodePgClient;
} & NodePgDatabase<typeof table>;

export class DBService {
	private db: DBClient;
	constructor(
		db: DBClient = drizzle(DATABASE_URL, { casing: 'snake_case', logger: true, schema: table })
	) {
		this.db = db;
	}

	async deleteSession(id: string) {
		return await this.db.delete(table.session).where(eq(table.session.id, id)).returning();
	}

	async insertSession(data: { expiresAt: Date; id: string; user: User }) {
		return await this.db.insert(table.session).values(data).returning();
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

	async updateSessionById({ expiresAt, id, user }: { expiresAt?: Date; id: string; user?: User }) {
		return this.db
			.update(table.session)
			.set({ expiresAt, user })
			.where(eq(table.session.id, id))
			.returning();
	}
}
