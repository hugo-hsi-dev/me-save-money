import { form, query } from '$app/server';
import { changeBudgetSchema } from '$lib/schemas/budget';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const getBudgetByAppliesTo = query(z.date(), async (date) => {
	const result = await db
		.select({
			amount: table.budget.amount,
			id: table.budget.id
		})
		.from(table.budget)
		.where(eq(table.budget.appliesTo, date))
		.limit(1);

	if (result.length === 0) {
		return { amount: '200.00' };
	}
	return result[0];
});

export const changeBudget = form(changeBudgetSchema, async ({ amount, appliesTo }) => {
	const insertResult = await db
		.insert(table.budget)
		.values({ amount, appliesTo })
		.onConflictDoUpdate({ set: { amount, appliesTo }, target: table.budget.appliesTo })
		.returning();

	await getBudgetByAppliesTo(insertResult[0].appliesTo).refresh();
});
