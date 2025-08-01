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
});
