import { form, query } from '$app/server';
import { addTransactionSchema } from '$lib/components/transaction/add-transaction-form.svelte';
import { ERRORS } from '$lib/server/errors';
import { DBService } from '$lib/server/service/db';
import { LocalsService } from '$lib/server/service/locals';
import { WeekService } from '$lib/server/service/week';
import z from 'zod';

export const createNewTransaction = form(async (formData) => {
	const rawData = Object.fromEntries(formData.entries());
	const result = addTransactionSchema.safeParse(rawData);

	if (!result.success) {
		return ERRORS.INTERNAL_SERVER_ERROR;
	}

	const dbService = new DBService();
	const localsService = new LocalsService();

	await dbService.insertTransaction({ ...result.data, user: localsService.validateSession().user });
});

export const getTransactionByWeek = query(z.date(), async (date) => {
	// await sleep();
	const dbService = new DBService();
	const data = await dbService.selectTransactionsByForWeek(date);
	return data;
});

export const getAmountSpentByWeek = query(
	z.object({ forWeek: z.date(), timezone: z.string() }),
	async ({ forWeek, timezone }) => {
		// await sleep();
		const dbService = new DBService();
		const result = await dbService.selectAmountSpentByForWeek({ forWeek, timezone });
		if (!result) return { amount: '0' };
		return result;
	}
);

export const getAmountSpentPerWeek = query(z.string(), async (timezone) => {
	// await sleep();
	const dbService = new DBService();
	const weekService = new WeekService();
	const result = await dbService.selectAmountSpentPerWeek(timezone);

	const grouped = weekService.groupAmountSpentByYear(result);
	const sorted = weekService.sortGroupedAmountSpentByYear(grouped);

	return sorted;
});
