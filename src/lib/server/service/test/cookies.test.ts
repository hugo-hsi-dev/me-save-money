/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Cookies } from '@sveltejs/kit';

import { beforeEach, describe, expect, it } from 'vitest';

import { CookiesService } from '../cookies';

// Mock implementation of SvelteKit's Cookies interface
class MockCookies implements Cookies {
	private options = new Map<string, any>();
	private store = new Map<string, string>();

	clear(): void {
		this.store.clear();
		this.options.clear();
	}

	delete(name: string): void {
		this.store.delete(name);
		this.options.delete(name);
	}

	get(name: string): string | undefined {
		return this.store.get(name);
	}

	getAll(): Array<{ name: string; value: string }> {
		return Array.from(this.store.entries()).map(([name, value]) => ({ name, value }));
	}

	getStoredOptions(name: string) {
		return this.options.get(name);
	}

	// Helper methods for testing
	getStoredValue(name: string): string | undefined {
		return this.store.get(name);
	}

	serialize(name: string, value: string): string {
		return `${name}=${value}`;
	}

	set(name: string, value: string, opts?: any): void {
		this.store.set(name, value);
		this.options.set(name, opts);
	}
}

describe('CookiesService', () => {
	let mockCookies: MockCookies;
	let cookiesService: CookiesService;

	beforeEach(() => {
		mockCookies = new MockCookies();
		cookiesService = new CookiesService(mockCookies);
	});

	describe('static properties', () => {
		it('should have correct session name', () => {
			expect(CookiesService.sessionName).toBe('session');
		});
	});

	describe('getSessionToken', () => {
		it('should return session token when it exists', () => {
			mockCookies.set('session', 'test-token');

			const token = cookiesService.getSessionToken();

			expect(token).toBe('test-token');
		});

		it('should return undefined when session token does not exist', () => {
			const token = cookiesService.getSessionToken();

			expect(token).toBeUndefined();
		});

		it('should return empty string when session token is empty', () => {
			mockCookies.set('session', '');

			const token = cookiesService.getSessionToken();

			expect(token).toBe('');
		});
	});

	describe('setSessionToken', () => {
		it('should set session token with correct options', () => {
			const expiresAt = new Date('2024-12-31T23:59:59Z');
			const token = 'abc123';

			cookiesService.setSessionToken({ expiresAt, token });

			expect(mockCookies.getStoredValue('session')).toBe(token);

			const options = mockCookies.getStoredOptions('session');
			expect(options).toEqual({
				expires: expiresAt,
				httpOnly: true,
				path: '/',
				sameSite: 'lax',
				secure: import.meta.env.PROD
			});
		});

		it('should handle different expiration dates', () => {
			const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
			const token = 'future-token';

			cookiesService.setSessionToken({ expiresAt: futureDate, token });

			expect(mockCookies.getStoredValue('session')).toBe(token);

			const options = mockCookies.getStoredOptions('session');
			expect(options.expires).toBe(futureDate);
		});

		it('should handle empty token', () => {
			const expiresAt = new Date();
			const token = '';

			cookiesService.setSessionToken({ expiresAt, token });

			expect(mockCookies.getStoredValue('session')).toBe('');
		});

		it('should handle long token strings', () => {
			const expiresAt = new Date();
			const token = 'a'.repeat(1000); // Very long token

			cookiesService.setSessionToken({ expiresAt, token });

			expect(mockCookies.getStoredValue('session')).toBe(token);
		});
	});

	describe('invalidateSessionToken', () => {
		it('should set session token to empty string with maxAge 0', () => {
			// First set a token
			mockCookies.set('session', 'existing-token');

			cookiesService.invalidateSessionToken();

			expect(mockCookies.getStoredValue('session')).toBe('');

			const options = mockCookies.getStoredOptions('session');
			expect(options).toEqual({
				httpOnly: true,
				maxAge: 0,
				path: '/',
				sameSite: 'lax',
				secure: import.meta.env.PROD
			});
		});

		it('should invalidate even when no previous token exists', () => {
			cookiesService.invalidateSessionToken();

			expect(mockCookies.getStoredValue('session')).toBe('');

			const options = mockCookies.getStoredOptions('session');
			expect(options.maxAge).toBe(0);
		});

		it('should use correct cookie options for invalidation', () => {
			cookiesService.invalidateSessionToken();

			const options = mockCookies.getStoredOptions('session');
			expect(options.httpOnly).toBe(true);
			expect(options.maxAge).toBe(0);
			expect(options.path).toBe('/');
			expect(options.sameSite).toBe('lax');
			expect(typeof options.secure).toBe('boolean');
		});
	});

	describe('integration scenarios', () => {
		it('should handle complete session lifecycle', () => {
			// 1. Initially no session
			expect(cookiesService.getSessionToken()).toBeUndefined();

			// 2. Set a session
			const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
			const token = 'session-abc-123';
			cookiesService.setSessionToken({ expiresAt, token });

			expect(cookiesService.getSessionToken()).toBe(token);

			// 3. Invalidate session
			cookiesService.invalidateSessionToken();

			expect(cookiesService.getSessionToken()).toBe('');
		});

		it('should handle setting multiple tokens in sequence', () => {
			const firstToken = 'token-1';
			const secondToken = 'token-2';
			const expiresAt = new Date();

			cookiesService.setSessionToken({ expiresAt, token: firstToken });
			expect(cookiesService.getSessionToken()).toBe(firstToken);

			cookiesService.setSessionToken({ expiresAt, token: secondToken });
			expect(cookiesService.getSessionToken()).toBe(secondToken);
		});

		it('should handle invalidation followed by new token', () => {
			// Set initial token
			const initialToken = 'initial-token';
			const expiresAt = new Date();
			cookiesService.setSessionToken({ expiresAt, token: initialToken });

			// Invalidate
			cookiesService.invalidateSessionToken();
			expect(cookiesService.getSessionToken()).toBe('');

			// Set new token
			const newToken = 'new-token';
			cookiesService.setSessionToken({ expiresAt, token: newToken });
			expect(cookiesService.getSessionToken()).toBe(newToken);
		});
	});

	describe('edge cases', () => {
		it('should handle special characters in token', () => {
			const specialToken = 'token-with-!@#$%^&*()_+-=[]{}|;:,.<>?';
			const expiresAt = new Date();

			cookiesService.setSessionToken({ expiresAt, token: specialToken });

			expect(cookiesService.getSessionToken()).toBe(specialToken);
		});

		it('should handle unicode characters in token', () => {
			const unicodeToken = 'token-with-🍪-emoji-and-中文';
			const expiresAt = new Date();

			cookiesService.setSessionToken({ expiresAt, token: unicodeToken });

			expect(cookiesService.getSessionToken()).toBe(unicodeToken);
		});

		it('should handle past expiration date', () => {
			const pastDate = new Date('2020-01-01');
			const token = 'expired-token';

			cookiesService.setSessionToken({ expiresAt: pastDate, token });

			expect(mockCookies.getStoredValue('session')).toBe(token);
			expect(mockCookies.getStoredOptions('session').expires).toBe(pastDate);
		});
	});
});
