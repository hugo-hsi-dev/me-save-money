import { error } from '@sveltejs/kit';
import { command } from '$app/server';
import { PIN } from '$env/static/private';
import { CookiesService } from '$lib/server/service/cookies';
import { DBService } from '$lib/server/service/db';
import { SessionService } from '$lib/server/service/session';
import { UserService } from '$lib/server/service/user';
import z from 'zod';

export const signIn = command(
	z.object({
		pin: z.string().length(6)
	}),
	async ({ pin }) => {
		const isValid = pin === PIN;

		if (!isValid) {
			error(401, 'Invalid PIN');
		}

		const sessionService = new SessionService();
		const dbService = new DBService();
		const cookieService = new CookiesService();

		const token = sessionService.generateNewToken();
		const id = sessionService.getIdFromToken(token);
		const expiresAt = sessionService.generateNewExpiration();
		const user = UserService.getDefaultUser();

		await dbService.insertSession({ expiresAt, id, user });
		cookieService.setSessionToken({ expiresAt, token });

		return { ok: true };
	}
);
