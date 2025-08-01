import { command, query } from '$app/server';
import { sleep } from '$lib';
import { USER_CONFIG } from '$lib/config';
import { DBService } from '$lib/server/service/db';
import { LocalsService } from '$lib/server/service/locals';
import z from 'zod';

export const getUser = query(async () => {
	await sleep();
	const localsService = new LocalsService();
	return localsService.validateSession().user;
});

export const changeUser = command(z.object({ user: z.enum(USER_CONFIG) }), async ({ user }) => {
	const localsService = new LocalsService();
	const dbService = new DBService();

	const sessionId = localsService.getSessionId();

	await dbService.updateSessionById({ id: sessionId, user });
	localsService.setUser(user);

	await getUser().refresh();
});
