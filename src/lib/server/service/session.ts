import type { RequestEvent } from '@sveltejs/kit';

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import { session, type User } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class SessionService {
	async deleteSession({ id }: { id: string }) {
		await db.delete(session).where(eq(session.id, id));
		return this;
	}

	generateNewExpiration() {
		return new Date(Date.now() + 60 * 60 * 24 * 30);
	}

	generateToken(): string {
		const tokenBytes = new Uint8Array(20);
		crypto.getRandomValues(tokenBytes);
		const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
		return token;
	}

	getDefaultUser() {
		return 'Cassie' as User;
	}

	getIdFromToken({ token }: { token: string }) {
		return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	}

	async insertSession({ expiresAt, id, user }: { expiresAt: Date; id: string; user: User }) {
		const data = {
			expiresAt,
			id,
			user
		};
		await db.insert(session).values(data);
		return this;
	}

	invalidateCookie(event: RequestEvent) {
		event.cookies.set('session', '', {
			httpOnly: true,
			maxAge: 0,
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD
		});
		return this;
	}

	async selectSession({ id }: { id: string }) {
		const result = await db
			.select({ expiresAt: session.expiresAt, user: session.user })
			.from(session)
			.where(eq(session.id, id))
			.limit(1);

		if (result.length === 0) {
			return undefined;
		}

		return result[0];
	}

	setCookie(event: RequestEvent, { expiresAt, token }: { expiresAt: Date; token: string }) {
		event.cookies.set('session', token, {
			expires: expiresAt,
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD
		});
		return this;
	}

	async updateSession({ expiresAt, id, user }: { expiresAt?: Date; id: string; user?: User }) {
		await db.update(session).set({ expiresAt, user }).where(eq(session.id, id));
		return this;
	}

	validateExpiration({ expiresAt }: { expiresAt: Date }) {
		return Date.now() >= expiresAt.getTime();
	}
}
