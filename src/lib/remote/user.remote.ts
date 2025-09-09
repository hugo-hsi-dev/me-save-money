import { command, getRequestEvent, query } from '$app/server';
import { USER_CONFIG } from '$lib/config';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { ERRORS } from '$lib/server/errors';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const getUser = query(async () => {
	const session = getRequestEvent().locals.session;
	if (!session) {
		return ERRORS.UNAUTHORIZED();
	}
	return session.user;
});

export const changeUser = command(z.object({ user: z.enum(USER_CONFIG) }), async ({ user }) => {
	const session = getRequestEvent().locals.session;
	if (!session) {
		return ERRORS.UNAUTHORIZED();
	}

	await db.update(table.session).set({ user }).where(eq(table.session.id, session.id));

	// Update the current session in locals
	session.user = user;

	await getUser().refresh();
});
