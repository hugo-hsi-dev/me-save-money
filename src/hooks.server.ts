import type { Handle } from '@sveltejs/kit';

import { SessionService } from '$lib/server/service/session';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');
	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const sessionService = new SessionService();
	const id = sessionService.getIdFromToken({ token });
	const result = await sessionService.selectSession({ id });

	if (!result) {
		sessionService.invalidateCookie(event);
		event.locals.user = null;
		event.locals.session = null;
	} else {
		sessionService.setCookie(event, { expiresAt: result.expiresAt, token });
		event.locals.user = result.user;
		event.locals.session = { expiresAt: result.expiresAt, id };
	}

	return resolve(event);
};
