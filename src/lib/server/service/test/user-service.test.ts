import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserService } from '../user-service';

// Mock SvelteKit functions
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn((status, location) => ({ location, status, type: 'redirect' }))
}));

vi.mock('$app/paths', () => ({
	resolve: vi.fn((path) => path)
}));

describe('UserService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('constructor', () => {
		it('should create instance with user', () => {
			const mockUser = 'Cassie';
			const userService = new UserService(mockUser);

			expect(userService).toBeInstanceOf(UserService);
		});

		it('should create instance with null user', () => {
			const userService = new UserService(null);

			expect(userService).toBeInstanceOf(UserService);
		});
	});

	describe('getUser', () => {
		it('should return the user when user exists', () => {
			const mockUser = 'Cassie';
			const userService = new UserService(mockUser);

			const result = userService.getUser();

			expect(result).toEqual(mockUser);
		});

		it('should return null when user is null', () => {
			const userService = new UserService(null);

			const result = userService.getUser();

			expect(result).toBeNull();
		});

		it('should return undefined when user is undefined', () => {
			// @ts-expect-error testing abnormal use case
			const userService = new UserService(undefined);

			const result = userService.getUser();

			expect(result).toBeUndefined();
		});
	});

	describe('validateUser', () => {
		it('should return user when user exists', () => {
			const mockUser = 'Cassie';
			const userService = new UserService(mockUser);

			const result = userService.validateUser();

			expect(result).toEqual(mockUser);
		});

		it('should redirect when user is null', async () => {
			const { redirect } = await import('@sveltejs/kit');
			const { resolve } = await import('$app/paths');

			const userService = new UserService(null);

			const result = userService.validateUser();

			expect(redirect).toHaveBeenCalledWith(303, '/');
			expect(resolve).toHaveBeenCalledWith('/');
			expect(result).toEqual({ location: '/', status: 303, type: 'redirect' });
		});

		it('should redirect when user is undefined', async () => {
			const { redirect } = await import('@sveltejs/kit');
			const { resolve } = await import('$app/paths');
			// @ts-expect-error testing abnormal use case
			const userService = new UserService(undefined);

			const result = userService.validateUser();

			expect(redirect).toHaveBeenCalledWith(303, '/');
			expect(resolve).toHaveBeenCalledWith('/');
			expect(result).toEqual({ location: '/', status: 303, type: 'redirect' });
		});

		it('should redirect when user is falsy (empty string)', async () => {
			const { redirect } = await import('@sveltejs/kit');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const userService = new UserService('' as any);

			const result = userService.validateUser();

			expect(redirect).toHaveBeenCalledWith(303, '/');
			expect(result).toEqual({ location: '/', status: 303, type: 'redirect' });
		});
	});
});
