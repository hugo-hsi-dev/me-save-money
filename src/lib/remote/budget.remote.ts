import { form, query } from '$app/server';
import { changeBudgetSchema } from '$lib/components/budget/edit-budget-form.svelte';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { ERRORS } from '$lib/server/errors';
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

export const changeBudget = form(async (formData) => {
	const data = Object.fromEntries(formData.entries());

	const validateResult = changeBudgetSchema.safeParse(data);

	if (!validateResult.success) {
		return ERRORS.BAD_REQUEST();
	}

	const insertResult = await db
		.insert(table.budget)
		.values(validateResult.data)
		.onConflictDoUpdate({ set: validateResult.data, target: table.budget.appliesTo })
		.returning();

	await getBudgetByAppliesTo(insertResult[0].appliesTo).refresh();
});
