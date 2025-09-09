import { z } from 'zod';

const baseTransactionSchema = z.object({
	amount: z
		.string()
		.min(1)
		.refine((amount) => !isNaN(Number(amount))),
	name: z.string().min(3, 'Transaction name must be at least 3 characters long')
});

export const addTransactionSchema = baseTransactionSchema.extend({
	paidAt: z.string().transform((input) => new Date(input))
});

export const changeTransactionSchema = baseTransactionSchema.extend({
	id: z.string()
});
