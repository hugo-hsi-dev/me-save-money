import type { User } from '$lib/config';
import type { DBClient } from '$lib/server/db';

import * as schema from '$lib/server/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { DBService } from '../db';

// Test database setup
let testDb: DBClient;
let dbService: DBService;

beforeAll(async () => {
	// Create a test database connection using the .env.test DATABASE_URL
	const testDatabaseUrl = process.env.DATABASE_URL;
	console.log(testDatabaseUrl);
	if (!testDatabaseUrl) {
		throw new Error('DATABASE_URL not found in environment variables');
	}

	testDb = drizzle(testDatabaseUrl, { casing: 'snake_case', schema });
	dbService = new DBService(testDb);
});

afterEach(async () => {
	// Clean up test data after each test
	await testDb.delete(schema.session);
});

describe('DBService', () => {
	it('should insert and select a session successfully', async () => {
		// Arrange
		const sessionData = {
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
			id: 'test-session-1',
			user: 'Hugo' as User
		};

		// Act - Insert session
		const insertResult = await dbService.insertSession(sessionData);

		// Assert - Insert returns the created session
		expect(insertResult).toHaveLength(1);
		expect(insertResult[0]).toMatchObject({
			expiresAt: sessionData.expiresAt,
			id: sessionData.id,
			user: sessionData.user
		});

		// Act - Select the session
		const selectedSession = await dbService.selectOneSession(sessionData.id);

		// Assert - Select returns the correct session data
		expect(selectedSession).toBeDefined();
		expect(selectedSession!.user).toBe(sessionData.user);
		expect(selectedSession!.expiresAt).toEqual(sessionData.expiresAt);
	});

	it('should return undefined when selecting a non-existent session', async () => {
		// Act
		const result = await dbService.selectOneSession('non-existent-session-id');

		// Assert
		expect(result).toBeUndefined();
	});

	it('should update session and delete session successfully', async () => {
		// Arrange - Create a session first
		const sessionData = {
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
			id: 'test-session-2',
			user: 'Cassie' as User
		};

		await dbService.insertSession(sessionData);

		// Act - Update the session with new expiration and user
		const newExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days from now
		const newUser = 'Hugo' as User;

		const updateResult = await dbService.updateSessionById({
			expiresAt: newExpiresAt,
			id: sessionData.id,
			user: newUser
		});

		// Assert - Update returns the updated session
		expect(updateResult).toHaveLength(1);
		expect(updateResult[0]).toMatchObject({
			expiresAt: newExpiresAt,
			id: sessionData.id,
			user: newUser
		});

		// Verify the update by selecting the session
		const updatedSession = await dbService.selectOneSession(sessionData.id);
		expect(updatedSession!.user).toBe(newUser);
		expect(updatedSession!.expiresAt).toEqual(newExpiresAt);

		// Act - Delete the session
		const deleteResult = await dbService.deleteSession(sessionData.id);

		// Assert - Delete returns the deleted session
		expect(deleteResult).toHaveLength(1);
		expect(deleteResult[0].id).toBe(sessionData.id);

		// Verify deletion by trying to select the session
		const deletedSession = await dbService.selectOneSession(sessionData.id);
		expect(deletedSession).toBeUndefined();
	});

	it('should handle partial updates correctly', async () => {
		// Arrange - Create a session first
		const sessionData = {
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			id: 'test-session-partial',
			user: 'Hugo' as User
		};

		await dbService.insertSession(sessionData);

		// Act - Update only the expiration date
		const newExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
		const updateResult = await dbService.updateSessionById({
			expiresAt: newExpiresAt,
			id: sessionData.id
			// Note: not updating user
		});

		// Assert - Only expiration should change, user should remain the same
		expect(updateResult).toHaveLength(1);
		expect(updateResult[0]).toMatchObject({
			expiresAt: newExpiresAt,
			id: sessionData.id,
			user: sessionData.user // Should remain unchanged
		});

		// Verify by selecting
		const updatedSession = await dbService.selectOneSession(sessionData.id);
		expect(updatedSession!.user).toBe(sessionData.user);
		expect(updatedSession!.expiresAt).toEqual(newExpiresAt);
	});

	it('should handle updating non-existent session', async () => {
		// Act - Try to update a session that doesn't exist
		const updateResult = await dbService.updateSessionById({
			expiresAt: new Date(),
			id: 'non-existent-session',
			user: 'Hugo' as User
		});

		// Assert - Should return empty array for non-existent session
		expect(updateResult).toHaveLength(0);
	});

	it('should handle deleting non-existent session', async () => {
		// Act - Try to delete a session that doesn't exist
		const deleteResult = await dbService.deleteSession('non-existent-session');

		// Assert - Should return empty array for non-existent session
		expect(deleteResult).toHaveLength(0);
	});

	it('should handle multiple sessions for different users', async () => {
		// Arrange - Create sessions for both users
		const hugoSession = {
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			id: 'hugo-session',
			user: 'Hugo' as User
		};

		const cassieSession = {
			expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
			id: 'cassie-session',
			user: 'Cassie' as User
		};

		// Act - Insert both sessions
		await dbService.insertSession(hugoSession);
		await dbService.insertSession(cassieSession);

		// Assert - Both sessions should be retrievable independently
		const retrievedHugo = await dbService.selectOneSession(hugoSession.id);
		const retrievedCassie = await dbService.selectOneSession(cassieSession.id);

		expect(retrievedHugo).toBeDefined();
		expect(retrievedHugo!.user).toBe('Hugo');

		expect(retrievedCassie).toBeDefined();
		expect(retrievedCassie!.user).toBe('Cassie');

		// Clean up - Delete both sessions
		const hugoDelete = await dbService.deleteSession(hugoSession.id);
		const cassieDelete = await dbService.deleteSession(cassieSession.id);

		expect(hugoDelete).toHaveLength(1);
		expect(cassieDelete).toHaveLength(1);
	});

	it('should handle sessions with same expiration times', async () => {
		// Arrange - Create sessions with identical expiration times
		const sharedExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

		const session1 = {
			expiresAt: sharedExpiration,
			id: 'session-same-exp-1',
			user: 'Hugo' as User
		};

		const session2 = {
			expiresAt: sharedExpiration,
			id: 'session-same-exp-2',
			user: 'Cassie' as User
		};

		// Act - Insert both sessions
		await dbService.insertSession(session1);
		await dbService.insertSession(session2);

		// Assert - Both sessions should be retrievable
		const retrieved1 = await dbService.selectOneSession(session1.id);
		const retrieved2 = await dbService.selectOneSession(session2.id);

		expect(retrieved1).toBeDefined();
		expect(retrieved1!.expiresAt).toEqual(sharedExpiration);
		expect(retrieved1!.user).toBe('Hugo');

		expect(retrieved2).toBeDefined();
		expect(retrieved2!.expiresAt).toEqual(sharedExpiration);
		expect(retrieved2!.user).toBe('Cassie');
	});

	it('should handle very old and very future expiration dates', async () => {
		// Arrange - Create sessions with extreme dates
		const veryOldDate = new Date('1990-01-01');
		const veryFutureDate = new Date('2099-12-31');

		const oldSession = {
			expiresAt: veryOldDate,
			id: 'old-session',
			user: 'Hugo' as User
		};

		const futureSession = {
			expiresAt: veryFutureDate,
			id: 'future-session',
			user: 'Cassie' as User
		};

		// Act - Insert both sessions
		await dbService.insertSession(oldSession);
		await dbService.insertSession(futureSession);

		// Assert - Both sessions should be stored correctly
		const retrievedOld = await dbService.selectOneSession(oldSession.id);
		const retrievedFuture = await dbService.selectOneSession(futureSession.id);

		expect(retrievedOld).toBeDefined();
		expect(retrievedOld!.expiresAt).toEqual(veryOldDate);

		expect(retrievedFuture).toBeDefined();
		expect(retrievedFuture!.expiresAt).toEqual(veryFutureDate);
	});

	it('should handle session IDs with special characters', async () => {
		// Arrange - Create session with special characters in ID
		const specialId = 'session-with-special_chars.123@test';
		const sessionData = {
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			id: specialId,
			user: 'Hugo' as User
		};

		// Act - Insert session
		const insertResult = await dbService.insertSession(sessionData);

		// Assert - Should handle special characters correctly
		expect(insertResult).toHaveLength(1);
		expect(insertResult[0].id).toBe(specialId);

		// Verify retrieval works
		const retrieved = await dbService.selectOneSession(specialId);
		expect(retrieved).toBeDefined();
		expect(retrieved!.user).toBe('Hugo');
	});

	it('should maintain data integrity across multiple operations', async () => {
		// Arrange - Create multiple sessions
		const sessions = [
			{
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
				id: 'integrity-1',
				user: 'Hugo' as User
			},
			{
				expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
				id: 'integrity-2',
				user: 'Cassie' as User
			},
			{
				expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
				id: 'integrity-3',
				user: 'Hugo' as User
			}
		];

		// Act - Insert all sessions
		for (const session of sessions) {
			await dbService.insertSession(session);
		}

		// Update some sessions
		await dbService.updateSessionById({
			id: 'integrity-1',
			user: 'Cassie' as User
		});

		// Delete one session
		await dbService.deleteSession('integrity-2');

		// Assert - Verify final state
		const session1 = await dbService.selectOneSession('integrity-1');
		const session2 = await dbService.selectOneSession('integrity-2');
		const session3 = await dbService.selectOneSession('integrity-3');

		expect(session1).toBeDefined();
		expect(session1!.user).toBe('Cassie'); // Should be updated

		expect(session2).toBeUndefined(); // Should be deleted

		expect(session3).toBeDefined();
		expect(session3!.user).toBe('Hugo'); // Should remain unchanged
	});
});
