import { form } from '$app/server';
import { ERRORS } from '$lib/server/errors';
import { DBService } from '$lib/server/service/db';
import { LocalsService } from '$lib/server/service/locals';
import z from 'zod';

const schema = z.object({
	amount: z.string().refine((amount) => !isNaN(Number(amount))),
	id: z.nanoid(),
	name: z.string(),
	paidAt: z.string().transform((input) => new Date(input))
});

export const createNewTransaction = form(async (formData) => {
	const rawData = Object.fromEntries(formData.entries());
	const result = schema.safeParse(rawData);

	if (!result.success) {
		return ERRORS.INTERNAL_SERVER_ERROR;
	}

	const dbService = new DBService();
	const localsService = new LocalsService();

	await dbService.insertTransaction({ ...result.data, user: localsService.validateSession().user });
});
