/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from '$lib/config';

import { beforeEach, describe, expect, it } from 'vitest';

import { LocalsService } from '../locals';

// Mock implementation of App.Locals
class MockLocals implements App.Locals {
	session: { expiresAt: Date; id: string; user: User } | null = null;

	clear() {
		this.session = null;
	}

	// Helper method for testing
	setSession(session: { expiresAt: Date; id: string; user: User } | null) {
		this.session = session;
	}
}

describe('LocalsService', () => {
	let mockLocals: MockLocals;
	let localsService: LocalsService;

	const createMockSession = (overrides?: Partial<{ expiresAt: Date; id: string; user: User }>) => ({
		expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
		id: 'session-123',
		user: 'Hugo' as User,
		...overrides
	});

	beforeEach(() => {
		mockLocals = new MockLocals();
		localsService = new LocalsService(mockLocals);
	});

	describe('getSessionId', () => {
		it('should return session id when session exists', () => {
			const session = createMockSession({ id: 'test-session-id' });
			mockLocals.setSession(session);

			const sessionId = localsService.getSessionId();

			expect(sessionId).toBe('test-session-id');
		});

		it('should throw UNAUTHORIZED error when session is null', () => {
			mockLocals.setSession(null);

			expect(() => localsService.getSessionId()).toThrow();
		});

		it('should throw error with status 401 when session is null', () => {
			mockLocals.setSession(null);

			try {
				localsService.getSessionId();
			} catch (err: any) {
				expect(err.status).toBe(401);
				expect(err.body.message).toBe(
					'Authentication required. Please log in to access this resource.'
				);
			}
		});
	});

	describe('setSession', () => {
		it('should set session in locals', () => {
			const session = createMockSession();

			localsService.setSession(session);

			expect(mockLocals.session).toBe(session);
		});

		it('should overwrite existing session', () => {
			const firstSession = createMockSession({ id: 'first-session' });
			const secondSession = createMockSession({ id: 'second-session' });

			localsService.setSession(firstSession);
			expect(mockLocals.session?.id).toBe('first-session');

			localsService.setSession(secondSession);
			expect(mockLocals.session?.id).toBe('second-session');
		});

		it('should handle session with different users', () => {
			const hugoSession = createMockSession({ user: 'Hugo' });
			const cassieSession = createMockSession({ user: 'Cassie' });

			localsService.setSession(hugoSession);
			expect(mockLocals.session?.user).toBe('Hugo');

			localsService.setSession(cassieSession);
			expect(mockLocals.session?.user).toBe('Cassie');
		});

		it('should handle session with different expiration dates', () => {
			const futureDate = new Date(Date.now() + 7200000); // 2 hours from now
			const session = createMockSession({ expiresAt: futureDate });

			localsService.setSession(session);

			expect(mockLocals.session?.expiresAt).toBe(futureDate);
		});
	});

	describe('setSessionNull', () => {
		it('should set session to null', () => {
			const session = createMockSession();
			mockLocals.setSession(session);
			expect(mockLocals.session).not.toBeNull();

			localsService.setSessionNull();

			expect(mockLocals.session).toBeNull();
		});

		it('should set session to null even when already null', () => {
			mockLocals.setSession(null);

			localsService.setSessionNull();

			expect(mockLocals.session).toBeNull();
		});
	});

	describe('setUser', () => {
		it('should update user in existing session', () => {
			const session = createMockSession({ user: 'Hugo' });
			mockLocals.setSession(session);

			localsService.setUser('Cassie');

			expect(mockLocals.session?.user).toBe('Cassie');
			expect(mockLocals.session?.id).toBe(session.id); // Other properties unchanged
			expect(mockLocals.session?.expiresAt).toBe(session.expiresAt);
		});

		it('should throw UNAUTHORIZED error when session is null', () => {
			mockLocals.setSession(null);

			expect(() => localsService.setUser('Hugo')).toThrow();
		});

		it('should throw error with status 401 when session is null', () => {
			mockLocals.setSession(null);

			try {
				localsService.setUser('Hugo');
			} catch (err: any) {
				expect(err.status).toBe(401);
				expect(err.body.message).toBe(
					'Authentication required. Please log in to access this resource.'
				);
			}
		});

		it('should handle switching between different users', () => {
			const session = createMockSession({ user: 'Hugo' });
			mockLocals.setSession(session);

			localsService.setUser('Cassie');
			expect(mockLocals.session?.user).toBe('Cassie');

			localsService.setUser('Hugo');
			expect(mockLocals.session?.user).toBe('Hugo');
		});
	});

	describe('validateSession', () => {
		it('should return session when it exists', () => {
			const session = createMockSession();
			mockLocals.setSession(session);

			const result = localsService.validateSession();

			expect(result).toBe(session);
		});

		it('should throw UNAUTHORIZED error when session is null', () => {
			mockLocals.setSession(null);

			expect(() => localsService.validateSession()).toThrow();
		});

		it('should throw error with correct status and message when session is null', () => {
			mockLocals.setSession(null);

			try {
				localsService.validateSession();
			} catch (err: any) {
				expect(err.status).toBe(401);
				expect(err.body.message).toBe(
					'Authentication required. Please log in to access this resource.'
				);
			}
		});

		it('should return the exact session object reference', () => {
			const session = createMockSession();
			mockLocals.setSession(session);

			const result = localsService.validateSession();

			expect(result).toBe(session); // Same reference
		});
	});

	describe('integration scenarios', () => {
		it('should handle complete session lifecycle', () => {
			// 1. Initially no session
			expect(() => localsService.validateSession()).toThrow();

			// 2. Set a session
			const session = createMockSession();
			localsService.setSession(session);
			expect(localsService.getSessionId()).toBe(session.id);

			// 3. Update user
			localsService.setUser('Cassie');
			expect(localsService.validateSession().user).toBe('Cassie');

			// 4. Clear session
			localsService.setSessionNull();
			expect(() => localsService.getSessionId()).toThrow();
		});

		it('should handle session replacement workflow', () => {
			const firstSession = createMockSession({
				id: 'session-1',
				user: 'Hugo'
			});
			const secondSession = createMockSession({
				id: 'session-2',
				user: 'Cassie'
			});

			// Set first session
			localsService.setSession(firstSession);
			expect(localsService.getSessionId()).toBe('session-1');
			expect(localsService.validateSession().user).toBe('Hugo');

			// Replace with second session
			localsService.setSession(secondSession);
			expect(localsService.getSessionId()).toBe('session-2');
			expect(localsService.validateSession().user).toBe('Cassie');
		});

		it('should handle user updates within same session', () => {
			const session = createMockSession({ user: 'Hugo' });
			localsService.setSession(session);

			const originalSessionId = localsService.getSessionId();

			// Update user multiple times
			localsService.setUser('Cassie');
			expect(localsService.getSessionId()).toBe(originalSessionId); // Same session
			expect(localsService.validateSession().user).toBe('Cassie');

			localsService.setUser('Hugo');
			expect(localsService.getSessionId()).toBe(originalSessionId); // Still same session
			expect(localsService.validateSession().user).toBe('Hugo');
		});
	});

	describe('edge cases', () => {
		it('should handle session with past expiration date', () => {
			const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
			const expiredSession = createMockSession({ expiresAt: pastDate });

			localsService.setSession(expiredSession);

			// Service doesn't validate expiration, just stores it
			expect(localsService.validateSession().expiresAt).toBe(pastDate);
			expect(localsService.getSessionId()).toBe(expiredSession.id);
		});

		it('should handle very long session IDs', () => {
			const longId = 'a'.repeat(1000);
			const session = createMockSession({ id: longId });

			localsService.setSession(session);

			expect(localsService.getSessionId()).toBe(longId);
		});

		it('should handle session with far future expiration', () => {
			const farFuture = new Date('2099-12-31T23:59:59Z');
			const session = createMockSession({ expiresAt: farFuture });

			localsService.setSession(session);

			expect(localsService.validateSession().expiresAt).toBe(farFuture);
		});

		it('should preserve session object immutability when getting reference', () => {
			const session = createMockSession();
			localsService.setSession(session);

			const retrieved1 = localsService.validateSession();
			const retrieved2 = localsService.validateSession();

			expect(retrieved1).toBe(retrieved2); // Same reference
			expect(retrieved1).toBe(session); // Original reference
		});
	});
});
