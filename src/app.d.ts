// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session: import('$lib/server/auth').Session;
			user: import('$lib/server/auth').User;
		}
		// interface Platform {}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
