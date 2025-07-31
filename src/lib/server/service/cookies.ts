import type { RequestEvent } from '@sveltejs/kit';

import { getRequestEvent } from '$app/server';

export class CookiesService {
	static sessionName = 'session';
	private cookies: RequestEvent['cookies'];
	constructor(cookies: RequestEvent['cookies'] = getRequestEvent().cookies) {
		this.cookies = cookies;
	}

	getSessionToken() {
		return this.cookies.get(CookiesService.sessionName);
	}

	invalidateSessionToken() {
		this.cookies.set(CookiesService.sessionName, '', {
			httpOnly: true,
			maxAge: 0,
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD
		});
	}

	setSessionToken({ expiresAt, token }: { expiresAt: Date; token: string }) {
		this.cookies.set(CookiesService.sessionName, token, {
			expires: expiresAt,
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD
		});
	}
}
