// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session: { expiresAt: Date; id: string };
			user: import('$lib/config').User | null;
		}
		// interface Platform {}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
