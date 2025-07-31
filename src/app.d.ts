// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from '$lib/config';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session: { expiresAt: Date; id: string; user: User } | null;
		}
		// interface Platform {}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
