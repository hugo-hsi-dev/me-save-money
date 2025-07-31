import { error } from '@sveltejs/kit';
import { command, getRequestEvent } from '$app/server';
import { PIN } from '$env/static/private';
import { SessionService } from '$lib/server/service/session';
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

		const token = sessionService.generateToken();
		const id = sessionService.getIdFromToken({ token });
		const expiresAt = sessionService.generateNewExpiration();
		const user = sessionService.getDefaultUser();

		await sessionService.insertSession({ expiresAt, id, user });

		const event = getRequestEvent();

		sessionService.setCookie(event, { expiresAt, token });

		return { ok: true };
	}
);
