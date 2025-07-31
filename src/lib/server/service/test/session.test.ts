import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SessionService } from '../session';

// Mock crypto.getRandomValues
const mockGetRandomValues = vi.fn();
Object.defineProperty(global, 'crypto', {
	value: { getRandomValues: mockGetRandomValues },
	writable: true
});

describe('SessionService', () => {
	let sessionService: SessionService;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockEvent: any;

	beforeEach(() => {
		// Mock RequestEvent
		mockEvent = {
			cookies: {
				set: vi.fn()
			}
		};

		sessionService = new SessionService();

		// Mock crypto.getRandomValues
		mockGetRandomValues.mockImplementation((array: Uint8Array) => {
			// Fill with predictable values for testing
			for (let i = 0; i < array.length; i++) {
				array[i] = i % 256;
			}
		});

		// Mock import.meta.env.PROD
		vi.stubGlobal('import', {
			meta: {
				env: {
					PROD: false
				}
			}
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.unstubAllGlobals();
	});

	describe('generateToken', () => {
		it('should generate a token', () => {
			const token = sessionService.generateToken();
			expect(typeof token).toBe('string');
			expect(token.length).toBeGreaterThan(0);
			expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
		});

		it('should generate different tokens on multiple calls', () => {
			// Mock different random values for each call
			mockGetRandomValues
				.mockImplementationOnce((array: Uint8Array) => {
					array.fill(1);
				})
				.mockImplementationOnce((array: Uint8Array) => {
					array.fill(2);
				});

			const token1 = sessionService.generateToken();
			const token2 = sessionService.generateToken();

			expect(token1).not.toBe(token2);
		});
	});

	describe('getIdFromToken', () => {
		it('should return consistent hash for same token', () => {
			const token = 'test-token';
			const id1 = sessionService.getIdFromToken({ token });
			const id2 = sessionService.getIdFromToken({ token });

			expect(id1).toBe(id2);
			expect(typeof id1).toBe('string');
			expect(id1.length).toBeGreaterThan(0);
		});

		it('should return different hashes for different tokens', () => {
			const id1 = sessionService.getIdFromToken({ token: 'token1' });
			const id2 = sessionService.getIdFromToken({ token: 'token2' });

			expect(id1).not.toBe(id2);
		});
	});

	describe('generateNewExpiration', () => {
		it('should return a date 30 days in the future', () => {
			const now = Date.now();
			const expiration = sessionService.generateNewExpiration();
			const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

			expect(expiration.getTime()).toBeGreaterThan(now);
			expect(expiration.getTime()).toBeLessThanOrEqual(now + thirtyDaysInMs + 1000); // 1s tolerance
		});
	});

	describe('getDefaultUser', () => {
		it('should return Cassie as default user', () => {
			const user = sessionService.getDefaultUser();
			expect(user).toBe('Cassie');
		});
	});

	describe('validateExpiration', () => {
		it('should return false for future date', () => {
			const futureDate = new Date(Date.now() + 60000); // 1 minute in future
			const isExpired = sessionService.validateExpiration({ expiresAt: futureDate });
			expect(isExpired).toBe(false);
		});

		it('should return true for past date', () => {
			const pastDate = new Date(Date.now() - 60000); // 1 minute in past
			const isExpired = sessionService.validateExpiration({ expiresAt: pastDate });
			expect(isExpired).toBe(true);
		});

		it('should return true for current time', () => {
			const now = new Date();
			const isExpired = sessionService.validateExpiration({ expiresAt: now });
			expect(isExpired).toBe(true);
		});
	});

	describe('method chaining', () => {
		it('should support method chaining for cookie operations', () => {
			const token = 'test-token';
			const expiresAt = new Date();

			const result = sessionService
				.setCookie(mockEvent, { expiresAt, token })
				.invalidateCookie(mockEvent);

			expect(result).toBe(sessionService);
			expect(mockEvent.cookies.set).toHaveBeenCalledTimes(2);
		});
	});
});
