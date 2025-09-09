import { error } from '@sveltejs/kit';
import { k } from '../chunks/event-state.js';
import { c } from '../chunks/command.js';
import { d, s, P } from '../chunks/index3.js';
import { g, h, a } from '../chunks/session-tokens.js';
import z from 'zod';
import '../chunks/form.js';
import '../chunks/false.js';
import '../chunks/paths.js';
import '../chunks/shared.js';
import '../chunks/query.js';
const signIn = c(
	z.object({
		pin: z.string().length(6)
	}),
	async ({ pin }) => {
		const isValid = pin === P;
		if (!isValid) {
			error(401, 'Invalid PIN');
		}
		const token = g();
		const id = h(token);
		const expiresAt = a();
		const user = 'Cassie';
		const cookies = k().cookies;
		cookies.set('session', token, {
			expires: expiresAt,
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: true
		});
		await d.insert(s).values({ expiresAt, id, user });
		return { ok: true };
	}
);
for (const [name, fn] of Object.entries({ signIn })) {
	fn.__.id = 'ja21py/' + name;
	fn.__.name = name;
}
export { signIn };
