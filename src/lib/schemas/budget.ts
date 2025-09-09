import { z } from 'zod';

export const changeBudgetSchema = z.object({
	amount: z.string().refine((amount) => !isNaN(Number(amount))),
	appliesTo: z.string().transform((input) => new Date(input))
});
