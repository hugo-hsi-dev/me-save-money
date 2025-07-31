import type { Handle } from '@sveltejs/kit';

import { CookiesService } from '$lib/server/service/cookies';
import { DBService } from '$lib/server/service/db';
import { LocalsService } from '$lib/server/service/locals';
import { SessionService } from '$lib/server/service/session';

export const handle: Handle = async ({ event, resolve }) => {
	const cookiesService = new CookiesService(event.cookies);
	const localsService = new LocalsService(event.locals);
	const sessionToken = cookiesService.getSessionToken();

	if (!sessionToken) {
		localsService.setSessionNull();
		return resolve(event);
	}

	const session = new SessionService();
	const db = new DBService();

	const sessionId = session.getIdFromToken(sessionToken);
	const result = await db.selectOneSession(sessionId);

	if (!result) {
		cookiesService.invalidateSessionToken();
		localsService.setSessionNull();
	} else {
		cookiesService.setSessionToken({ expiresAt: result.expiresAt, token: sessionToken });
		localsService.setSession({ ...result, id: sessionId });
	}

	return resolve(event);
};
