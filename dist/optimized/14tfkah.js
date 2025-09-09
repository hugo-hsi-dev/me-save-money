import { k } from '../chunks/event-state.js';
import { c } from '../chunks/command.js';
import '@sveltejs/kit';
import { q } from '../chunks/query.js';
import { U, d, s } from '../chunks/index3.js';
import { E } from '../chunks/errors.js';
import { eq } from 'drizzle-orm';
import z from 'zod';
import '../chunks/form.js';
import '../chunks/false.js';
import '../chunks/paths.js';
import '../chunks/shared.js';
const getUser = q(async () => {
	const session2 = k().locals.session;
	if (!session2) {
		return E.UNAUTHORIZED();
	}
	return session2.user;
});
const changeUser = c(z.object({ user: z.enum(U) }), async ({ user }) => {
	const session$1 = k().locals.session;
	if (!session$1) {
		return E.UNAUTHORIZED();
	}
	await d.update(s).set({ user }).where(eq(s.id, session$1.id));
	session$1.user = user;
	await getUser().refresh();
});
for (const [name, fn] of Object.entries({ changeUser, getUser })) {
	fn.__.id = '14tfkah/' + name;
	fn.__.name = name;
}
export { changeUser, getUser };
