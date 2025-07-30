import { command, getRequestEvent, query } from '$app/server';
import { createSession, deleteSessionTokenCookie } from '$lib/server/auth';

export const test = command(() => {
	const event = getRequestEvent();
	console.log('this ran');
	deleteSessionTokenCookie(event);
	return 'this ran';
});
