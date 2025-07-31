import { getRequestEvent, query } from '$app/server';

export const getUser = query(() => {
	const event = getRequestEvent();
	return event.locals.user;
});
