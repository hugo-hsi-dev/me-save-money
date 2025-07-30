import type { RequestEvent } from '@sveltejs/kit';

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

import type { UserName } from './db/schema';

import { db } from './db';
import * as tables from './db/schema';

export type Session = Awaited<ReturnType<typeof validateSessionToken>>['session'];
export type User = Awaited<ReturnType<typeof validateSessionToken>>['user'];

export async function createSession(token: string, user: UserName) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = {
		expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30), // 30 days
		id: sessionId,
		user
	};

	const [result] = await db.insert(tables.session).values(session).returning();

	return result;
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		maxAge: 0,
		path: '/',
		sameSite: 'lax',
		secure: import.meta.env.PROD
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export function invalidateSession(sessionId: string) {
	db.delete(tables.session).where(eq(tables.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set('session', token, {
		expires: expiresAt,
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: import.meta.env.PROD
	});
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const row = await db.query.session.findFirst({
		where: (table, { eq }) => eq(table.id, sessionId)
	});

	if (!row) {
		return { session: null, user: null };
	}

	const { expiresAt, id, user } = row;

	const session = { expiresAt, id };

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(tables.session).where(eq(tables.session.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() + 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 60 * 60 * 24 * 30);
		await db
			.update(tables.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(tables.session.id, session.id));
	}
	return { session, user };
}
