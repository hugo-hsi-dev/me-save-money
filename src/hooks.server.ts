import type { Handle } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import {
	generateSessionExpiration,
	hashSessionToken,
	isSessionExpired
} from '$lib/server/utils/session-tokens';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');

	if (!sessionToken) {
		event.locals.session = null;
		return resolve(event);
	}

	const sessionId = hashSessionToken(sessionToken);
	const result = await db
		.select({ expiresAt: table.session.expiresAt, user: table.session.user })
		.from(table.session)
		.where(eq(table.session.id, sessionId))
		.limit(1);

	if (result.length === 0) {
		event.cookies.set('session', '', {
			httpOnly: true,
			maxAge: 0,
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD
		});
		event.locals.session = null;
		return resolve(event);
	}

	const session = result[0];

	if (isSessionExpired(session.expiresAt)) {
		event.cookies.set('session', '', {
			httpOnly: true,
			maxAge: 0,
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD
		});
		event.locals.session = null;
		await db.delete(table.session).where(eq(table.session.id, sessionId));
		return resolve(event);
	}

	const newExpiresAt = generateSessionExpiration();

	event.cookies.set('session', sessionToken, {
		expires: newExpiresAt,
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: import.meta.env.PROD
	});
	event.locals.session = { ...session, id: sessionId };
	db.update(table.session).set({ expiresAt: newExpiresAt }).where(eq(table.session.id, sessionId));
	return resolve(event);
};
