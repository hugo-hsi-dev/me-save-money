import { error } from '@sveltejs/kit';
import { command, getRequestEvent } from '$app/server';
import { PIN } from '$env/static/private';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import {
	generateSessionExpiration,
	generateSessionToken,
	hashSessionToken
} from '$lib/server/utils/session-tokens';
import z from 'zod';

export const signIn = command(
	z.object({
		pin: z.string().length(6)
	}),
	async ({ pin }) => {
		const isValid = pin === PIN;

		if (!isValid) {
			error(401, 'Invalid PIN');
		}

		const token = generateSessionToken();
		const id = hashSessionToken(token);
		const expiresAt = generateSessionExpiration();
		const user = 'Cassie';

		const cookies = getRequestEvent().cookies;
		cookies.set('session', token, {
			expires: expiresAt,
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD
		});

		await db.insert(table.session).values({ expiresAt, id, user });

		return { ok: true };
	}
);
