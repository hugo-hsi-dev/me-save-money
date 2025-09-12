import { command, form, getRequestEvent, query } from '$app/server';
import { addTransactionSchema, changeTransactionSchema } from '$lib/schemas/transaction';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { ERRORS } from '$lib/server/errors';
import { eq, sql, sum } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';

export const createNewTransaction = form(async (formData) => {
	const rawData = Object.fromEntries(formData.entries());
	const result = addTransactionSchema.safeParse(rawData);

	if (!result.success) {
		return { error: result.error.issues, success: false };
	}

	const session = getRequestEvent().locals.session;
	if (!session) {
		return ERRORS.UNAUTHORIZED();
	}

	await db.insert(table.transaction).values({ id: nanoid(), ...result.data, user: session.user });

	return { error: undefined, success: true };
});

export const changeTransaction = form(async (formData) => {
	const data = Object.fromEntries(formData.entries());

	const validateResult = changeTransactionSchema.safeParse(data);

	if (!validateResult.success) {
		return ERRORS.BAD_REQUEST();
	}

	await db
		.update(table.transaction)
		.set({ amount: validateResult.data.amount, name: validateResult.data.name })
		.where(eq(table.transaction.id, validateResult.data.id));
});

export const deleteTransaction = command(z.object({ id: z.string() }), async ({ id }) => {
	const transaction = await db
		.delete(table.transaction)
		.where(eq(table.transaction.id, id))
		.returning();

	if (transaction.length > 0) {
		await getTransactionByWeek(transaction[0].forWeek).refresh();
	}
});

export const getTransactionByWeek = query(z.date(), async (date) => {
	const data = await db
		.select({
			amount: table.transaction.amount,
			forWeek: table.transaction.forWeek,
			id: table.transaction.id,
			name: table.transaction.name,
			paidAt: table.transaction.paidAt,
			user: table.transaction.user
		})
		.from(table.transaction)
		.where(eq(table.transaction.forWeek, date));

	return data.sort((a, b) => a.paidAt.getTime() - b.paidAt.getTime());
});

export const getAmountSpentByWeek = query(
	z.object({ forWeek: z.date(), timezone: z.string() }),
	async ({ forWeek, timezone }) => {
		const week = sql`${table.transaction.forWeek} AT TIME ZONE '${sql.raw(timezone)}'`.mapWith(
			table.transaction.forWeek
		);

		const result = await db
			.select({
				amount: sql<string>`COALESCE(${sum(table.transaction.amount)}, '0')`
			})
			.from(table.transaction)
			.groupBy(week)
			.where(eq(table.transaction.forWeek, forWeek))
			.limit(1);

		if (result.length === 0) return { amount: '0' };
		return result[0];
	}
);

export const getAmountSpentPerWeek = query(z.string(), async (timezone) => {
	const week = sql`${table.transaction.forWeek} AT TIME ZONE '${sql.raw(timezone)}'`.mapWith(
		table.transaction.forWeek
	);

	const result = await db
		.select({
			amount: sql<string>`COALESCE(${sum(table.transaction.amount)}, '0')`,
			week
		})
		.from(table.transaction)
		.groupBy(week);

	// Group by year and nest the data one layer down
	const groupedByYear = result.reduce(
		(acc: { weeks: { amount: string; week: Date }[]; year: number }[], curr) => {
			const year = new Date(curr.week).getFullYear();
			const existingYear = acc.find((y) => y.year === year);

			if (existingYear) {
				existingYear.weeks.push({
					amount: curr.amount?.toString() || '0',
					week: new Date(curr.week)
				});
			} else {
				acc.push({
					weeks: [
						{
							amount: curr.amount?.toString() || '0',
							week: new Date(curr.week)
						}
					],
					year
				});
			}

			return acc;
		},
		[]
	);

	// Sort by year descending and weeks descending within each year
	const sorted = groupedByYear
		.sort((a, b) => b.year - a.year)
		.map((yearData) => ({
			...yearData,
			weeks: yearData.weeks.sort((a, b) => b.week.getTime() - a.week.getTime())
		}));

	return sorted;
});

