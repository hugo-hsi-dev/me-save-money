import { command, query } from '$app/server';
import { DBService } from '$lib/server/service/db';
import z from 'zod';

export const getBudgets = query(async () => {
	const dbService = new DBService();
	return dbService.getBudgets();
});

export const getBudgetByDate = query(z.date(), async (data) => {
	const dbService = new DBService();
	return dbService.getBudget();
});

export const changeBudget = command(
	z.object({ amount: z.string(), id: z.string(), name: z.string() }),
	async ({ amount, id, name }) => {
		const dbService = new DBService();
		await dbService.updatePreset({ amount, id, name });
		await getPresets().refresh();
	}
);

export const deleteBudget = command(z.object({ id: z.string() }), async ({ id }) => {
	const dbService = new DBService();
	await dbService.deletePreset(id);
	await getPresets().refresh();
});
