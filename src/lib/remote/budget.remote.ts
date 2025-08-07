import { form, query } from '$app/server';
import { changeBudgetSchema } from '$lib/components/budget/edit-budget-form.svelte';
import { ERRORS } from '$lib/server/errors';
import { DBService } from '$lib/server/service/db';
import z from 'zod';

export const getBudgetByAppliesTo = query(z.date(), async (date) => {
	const dbService = new DBService();
	const result = await dbService.selectBudgetByAppliesTo(date);
	if (!result) {
		return { amount: '200.00' };
	}
	return result;
});

export const changeBudget = form(async (formData) => {
	const dbService = new DBService();

	const data = Object.fromEntries(formData.entries());

	const validateResult = changeBudgetSchema.safeParse(data);

	if (!validateResult.success) {
		return ERRORS.BAD_REQUEST();
	}

	console.log(validateResult.data);
	const insertResult = await dbService.insertOrUpdateBudget(validateResult.data);

	await getBudgetByAppliesTo(insertResult[0].appliesTo).refresh();
});
