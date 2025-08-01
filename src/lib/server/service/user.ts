import type { User } from '$lib/config';

export class UserService {
	static getDefaultUser(): User {
		return 'Cassie';
	}
}
