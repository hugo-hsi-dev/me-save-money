import type { User } from '$lib/config';

import { type RequestEvent } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { ERRORS } from '$lib/server/errors';

export class LocalsService {
	private locals: RequestEvent['locals'];

	constructor(locals: RequestEvent['locals'] = getRequestEvent().locals) {
		this.locals = locals;
	}

	getSessionId() {
		return this.validateSession().id;
	}

	setSession(session: NonNullable<App.Locals['session']>) {
		this.locals.session = session;
	}

	setSessionNull() {
		this.locals.session = null;
	}

	setUser(user: User) {
		this.validateSession().user = user;
	}

	validateSession() {
		if (!this.locals.session) {
			return ERRORS.UNAUTHORIZED();
		}
		return this.locals.session;
	}
}
