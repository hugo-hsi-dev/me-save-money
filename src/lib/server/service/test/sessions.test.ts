import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SessionService } from '../session';

describe('SessionService', () => {
	let sessionService: SessionService;

	beforeEach(() => {
		sessionService = new SessionService();
		// Reset any mocked timers before each test
		vi.useRealTimers();
	});

	describe('checkIsExpired', () => {
		it('should return false for future expiration date', () => {
			// Arrange
			const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

			// Act
			const result = sessionService.checkIsExpired(futureDate);

			// Assert
			expect(result).toBe(false);
		});

		it('should return true for past expiration date', () => {
			// Arrange
			const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

			// Act
			const result = sessionService.checkIsExpired(pastDate);

			// Assert
			expect(result).toBe(true);
		});

		it('should return true for current time (exactly expired)', () => {
			// Arrange
			const now = Date.now();
			vi.setSystemTime(now);
			const exactlyNow = new Date(now);

			// Act
			const result = sessionService.checkIsExpired(exactlyNow);

			// Assert
			expect(result).toBe(true);
		});

		it('should handle very old dates', () => {
			// Arrange
			const veryOldDate = new Date('1990-01-01');

			// Act
			const result = sessionService.checkIsExpired(veryOldDate);

			// Assert
			expect(result).toBe(true);
		});

		it('should handle very future dates', () => {
			// Arrange
			const veryFutureDate = new Date('2099-12-31');

			// Act
			const result = sessionService.checkIsExpired(veryFutureDate);

			// Assert
			expect(result).toBe(false);
		});

		it('should handle dates with millisecond precision', () => {
			// Arrange
			const now = Date.now();
			const justBefore = new Date(now - 1); // 1ms ago
			const justAfter = new Date(now + 1); // 1ms from now

			vi.setSystemTime(now);

			// Act & Assert
			expect(sessionService.checkIsExpired(justBefore)).toBe(true);
			expect(sessionService.checkIsExpired(justAfter)).toBe(false);
		});
	});

	describe('generateNewExpiration', () => {
		it('should generate expiration date 30 days from now', () => {
			// Arrange
			const fixedTime = 1700000000000; // Fixed timestamp
			const expectedExpiration = fixedTime + 60 * 60 * 24 * 30 * 1000; // 30 days in ms
			vi.spyOn(Date, 'now').mockReturnValue(fixedTime);

			// Act
			const result = sessionService.generateNewExpiration();

			// Assert
			expect(result.getTime()).toBe(expectedExpiration);

			// Cleanup
			vi.restoreAllMocks();
		});

		it('should generate different times when called at different moments', () => {
			// Arrange
			const time1 = 1700000000000;
			const time2 = time1 + 5000; // 5 seconds later

			// Act
			vi.spyOn(Date, 'now').mockReturnValue(time1);
			const expiration1 = sessionService.generateNewExpiration();

			vi.spyOn(Date, 'now').mockReturnValue(time2);
			const expiration2 = sessionService.generateNewExpiration();

			// Assert
			expect(expiration2.getTime()).toBeGreaterThan(expiration1.getTime());
			const timeDiff = expiration2.getTime() - expiration1.getTime();
			expect(timeDiff).toBe(5000);

			// Cleanup
			vi.restoreAllMocks();
		});

		it('should always return a Date object', () => {
			// Act
			const result = sessionService.generateNewExpiration();

			// Assert
			expect(result).toBeInstanceOf(Date);
		});

		it('should generate expiration in the future', () => {
			// Arrange
			const now = Date.now();

			// Act
			const result = sessionService.generateNewExpiration();

			// Assert
			expect(result.getTime()).toBeGreaterThan(now);
		});
	});

	describe('generateNewToken', () => {
		it('should generate a string token', () => {
			// Act
			const token = sessionService.generateNewToken();

			// Assert
			expect(typeof token).toBe('string');
			expect(token.length).toBeGreaterThan(0);
		});

		it('should generate different tokens on each call', () => {
			// Act
			const token1 = sessionService.generateNewToken();
			const token2 = sessionService.generateNewToken();
			const token3 = sessionService.generateNewToken();

			// Assert
			expect(token1).not.toBe(token2);
			expect(token2).not.toBe(token3);
			expect(token1).not.toBe(token3);
		});

		it('should generate tokens with consistent length', () => {
			// Act
			const tokens = Array.from({ length: 10 }, () => sessionService.generateNewToken());

			// Assert
			const lengths = tokens.map((token) => token.length);
			const firstLength = lengths[0];
			expect(lengths.every((length) => length === firstLength)).toBe(true);
		});

		it('should generate tokens containing only valid base32 characters', () => {
			// Arrange
			const validBase32Chars = /^[a-z2-7]+$/;

			// Act
			const tokens = Array.from({ length: 10 }, () => sessionService.generateNewToken());

			// Assert
			tokens.forEach((token) => {
				expect(token).toMatch(validBase32Chars);
			});
		});

		it('should generate tokens that are lowercase', () => {
			// Act
			const tokens = Array.from({ length: 10 }, () => sessionService.generateNewToken());

			// Assert
			tokens.forEach((token) => {
				expect(token).toBe(token.toLowerCase());
			});
		});

		it('should generate tokens with expected length for 20-byte input', () => {
			// Act
			const token = sessionService.generateNewToken();

			// Assert
			// 20 bytes = 160 bits, base32 encodes 5 bits per character
			// 160/5 = 32 characters (without padding)
			expect(token.length).toBe(32);
		});
	});

	describe('getIdFromToken', () => {
		it('should generate consistent ID for the same token', () => {
			// Arrange
			const token = 'test-token-123';

			// Act
			const id1 = sessionService.getIdFromToken(token);
			const id2 = sessionService.getIdFromToken(token);

			// Assert
			expect(id1).toBe(id2);
		});

		it('should generate different IDs for different tokens', () => {
			// Arrange
			const token1 = 'token-one';
			const token2 = 'token-two';

			// Act
			const id1 = sessionService.getIdFromToken(token1);
			const id2 = sessionService.getIdFromToken(token2);

			// Assert
			expect(id1).not.toBe(id2);
		});

		it('should return a string', () => {
			// Arrange
			const token = 'any-token';

			// Act
			const id = sessionService.getIdFromToken(token);

			// Assert
			expect(typeof id).toBe('string');
		});

		it('should generate hex-encoded lowercase string', () => {
			// Arrange
			const token = 'test-token';
			const hexPattern = /^[a-f0-9]+$/;

			// Act
			const id = sessionService.getIdFromToken(token);

			// Assert
			expect(id).toMatch(hexPattern);
		});

		it('should generate consistent length IDs (SHA256 = 64 hex chars)', () => {
			// Arrange
			const tokens = ['short', 'medium-length-token', 'very-long-token-with-many-characters'];

			// Act
			const ids = tokens.map((token) => sessionService.getIdFromToken(token));

			// Assert
			ids.forEach((id) => {
				expect(id.length).toBe(64); // SHA256 = 32 bytes = 64 hex characters
			});
		});

		it('should handle empty string token', () => {
			// Arrange
			const emptyToken = '';

			// Act
			const id = sessionService.getIdFromToken(emptyToken);

			// Assert
			expect(typeof id).toBe('string');
			expect(id.length).toBe(64);
		});

		it('should handle tokens with special characters', () => {
			// Arrange
			const specialToken = 'token!@#$%^&*()_+-=[]{}|;:,.<>?';

			// Act
			const id = sessionService.getIdFromToken(specialToken);

			// Assert
			expect(typeof id).toBe('string');
			expect(id.length).toBe(64);
		});

		it('should handle unicode characters', () => {
			// Arrange
			const unicodeToken = 'token-with-émojis-🚀🎉';

			// Act
			const id = sessionService.getIdFromToken(unicodeToken);

			// Assert
			expect(typeof id).toBe('string');
			expect(id.length).toBe(64);
		});

		it('should be deterministic across multiple calls', () => {
			// Arrange
			const token = 'deterministic-test-token';
			const iterations = 100;

			// Act
			const ids = Array.from({ length: iterations }, () => sessionService.getIdFromToken(token));

			// Assert
			const firstId = ids[0];
			expect(ids.every((id) => id === firstId)).toBe(true);
		});
	});

	describe('integration tests', () => {
		it('should work with generated tokens to create session IDs', () => {
			// Act
			const token = sessionService.generateNewToken();
			const sessionId = sessionService.getIdFromToken(token);
			const expiration = sessionService.generateNewExpiration();

			// Assert
			expect(typeof token).toBe('string');
			expect(typeof sessionId).toBe('string');
			expect(expiration).toBeInstanceOf(Date);

			expect(token.length).toBe(32); // base32 encoded 20 bytes
			expect(sessionId.length).toBe(64); // hex encoded SHA256
			expect(sessionService.checkIsExpired(expiration)).toBe(false);
		});

		it('should create unique session workflows', () => {
			// Act - Create multiple complete session workflows
			const sessions = Array.from({ length: 5 }, () => ({
				expiration: sessionService.generateNewExpiration(),
				token: sessionService.generateNewToken()
			})).map((session) => ({
				...session,
				id: sessionService.getIdFromToken(session.token)
			}));

			// Assert - All components should be unique
			const tokens = sessions.map((s) => s.token);
			const ids = sessions.map((s) => s.id);

			expect(new Set(tokens).size).toBe(sessions.length);
			expect(new Set(ids).size).toBe(sessions.length);

			sessions.forEach((session) => {
				expect(sessionService.checkIsExpired(session.expiration)).toBe(false);
			});
		});

		it('should handle expired session workflow', () => {
			// Arrange
			const pastTime = Date.now() - 1000 * 60 * 60 * 24 * 30; // 1 month ago
			vi.setSystemTime(pastTime);

			const token = sessionService.generateNewToken();
			const sessionId = sessionService.getIdFromToken(token);
			const expiration = sessionService.generateNewExpiration();

			// Fast forward to present
			vi.useRealTimers();

			// Act & Assert
			expect(sessionService.checkIsExpired(expiration)).toBe(true);

			// Token and ID generation should still work
			expect(typeof token).toBe('string');
			expect(typeof sessionId).toBe('string');
		});
	});
});
