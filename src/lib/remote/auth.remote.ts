import { error, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { command, getRequestEvent, query } from '$app/server';
import { PIN } from '$env/static/private';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { UserService } from '$lib/server/service/user';
import z from 'zod';

export const getUser = query(z.object({ validateUser: z.boolean() }), ({ validateUser }) => {
	const event = getRequestEvent();

	const User = new UserService(event.locals.user);

	if (validateUser) {
		return User.validateUser();
	}
	return User.getUser();
});

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
