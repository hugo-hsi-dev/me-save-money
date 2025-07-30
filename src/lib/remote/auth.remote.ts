import { error } from '@sveltejs/kit';
import { command, getRequestEvent } from '$app/server';
import { PIN } from '$env/static/private';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
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

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, 'Cassie');

		const event = getRequestEvent();

		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return { ok: true };
	}
);
