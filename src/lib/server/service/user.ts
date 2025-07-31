import type { RequestEvent } from '@sveltejs/kit';
import type { User } from '$lib/config';

import { SessionService } from '$lib/server/service/session';

export class UserService {
	changeLocalUser(event: RequestEvent, { user }: { user: User }) {
		event.locals.user = user;
		return this;
	}
	async changeSessionUser(
		event: RequestEvent,
		{
			sessionService,
			user
		}: {
			sessionService: SessionService;
			user: User;
		}
	) {
		const id = event.locals.session.id;
		await sessionService.updateSession({ id, user });
		return this;
	}
}
