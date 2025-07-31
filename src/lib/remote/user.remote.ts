import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { command, getRequestEvent, query } from '$app/server';
import { USER_CONFIG } from '$lib/config';
import { SessionService } from '$lib/server/service/session';
import { UserService } from '$lib/server/service/user';
import z from 'zod';

export const getUser = query(() => {
	const event = getRequestEvent();
	const user = event.locals.user;
	if (!user) {
		return redirect(303, resolve('/'));
	}
	return user;
});

export const changeUser = command(z.object({ user: z.enum(USER_CONFIG) }), async ({ user }) => {
	const event = getRequestEvent();
	const sessionService = new SessionService();
	const userService = new UserService();
	await userService
		.changeLocalUser(event, { user })
		.changeSessionUser(event, { sessionService, user });
	await getUser().refresh();
});
