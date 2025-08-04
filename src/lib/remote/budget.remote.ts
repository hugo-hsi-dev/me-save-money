import { command, query } from '$app/server';
import { DBService } from '$lib/server/service/db';
import z from 'zod';

export const getBudgets = query(async () => {
	const dbService = new DBService();
	return dbService.getBudgets();
});

export const getBudgetByDate = query(z.date(), async (date) => {
	const dbService = new DBService();
	return dbService.getBudgetByDate(date);
});

export const changeBudget = command(
	z.object({ amount: z.string(), id: z.number()}),
	async ({ amount, id }) => {
		const dbService = new DBService();
		const budget = await dbService.updateBudget({ amount, id });
		await getBudgets().refresh();
		await getBudgetByDate(budget[0].appliesTo).refresh();
	}
);

export const deleteBudget = command(z.object({ id: z.string() }), async ({ id }) => {
	const dbService = new DBService();
	await dbService.deleteBudget(id);
	await getBudgets().refresh();
});
