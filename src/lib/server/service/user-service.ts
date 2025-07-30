import type { User } from '$lib/server/auth';

import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export class UserService {
	#user: User;
	constructor(user: User) {
		this.#user = user;
	}
	getUser() {
		return this.#user;
	}
	validateUser() {
		if (!this.#user) {
			return redirect(303, resolve('/'));
		}
		return this.#user;
	}
}
