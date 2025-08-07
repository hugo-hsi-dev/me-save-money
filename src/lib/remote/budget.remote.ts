import { command, query } from '$app/server';
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

export const changeBudget = command(
	z.object({ amount: z.string(), id: z.string() }),
	async ({ amount, id }) => {
		const dbService = new DBService();
		const budget = await dbService.updateBudget({ amount, id });
		await getBudgetByAppliesTo(budget[0].appliesTo).refresh();
	}
);
