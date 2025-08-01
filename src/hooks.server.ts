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

	const sessionService = new SessionService();
	const dbService = new DBService();

	const sessionId = sessionService.getIdFromToken(sessionToken);
	const session = await dbService.selectOneSession(sessionId);

	if (!session) {
		cookiesService.invalidateSessionToken();
		localsService.setSessionNull();
		return resolve(event);
	}

	const isExpired = sessionService.checkIsExpired(session.expiresAt);

	if (isExpired) {
		cookiesService.invalidateSessionToken();
		localsService.setSessionNull();
		await dbService.deleteSession(sessionId);
		return resolve(event);
	}

	const newExpiresAt = sessionService.generateNewExpiration();

	cookiesService.setSessionToken({
		expiresAt: newExpiresAt,
		token: sessionToken
	});
	localsService.setSession({ ...session, id: sessionId });
	dbService.updateSessionById({ expiresAt: newExpiresAt, id: sessionId });
	return resolve(event);
};
