import { k } from "../chunks/event-state.js";
import { c } from "../chunks/command.js";
import { f } from "../chunks/form.js";
import "@sveltejs/kit";
import { q } from "../chunks/query.js";
import z$1, { z } from "zod";
import { d, t } from "../chunks/index3.js";
import { E } from "../chunks/errors.js";
import { eq, sql, sum } from "drizzle-orm";
import { nanoid } from "nanoid";
import "../chunks/false.js";
import "../chunks/paths.js";
import "../chunks/shared.js";
const baseTransactionSchema = z.object({
  amount: z.string().min(1).refine((amount) => !isNaN(Number(amount))),
  name: z.string().min(3, "Transaction name must be at least 3 characters long")
});
const addTransactionSchema = baseTransactionSchema.extend({
  paidAt: z.string().transform((input) => new Date(input))
});
const changeTransactionSchema = baseTransactionSchema.extend({
  id: z.string()
});
const createNewTransaction = f(async (formData) => {
  const rawData = Object.fromEntries(formData.entries());
  const result = addTransactionSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues, success: false };
  }
  const session = k().locals.session;
  if (!session) {
    return E.UNAUTHORIZED();
  }
  await d.insert(t).values({ id: nanoid(), ...result.data, user: session.user });
  return { error: void 0, success: true };
});
const changeTransaction = f(async (formData) => {
  const data = Object.fromEntries(formData.entries());
  const validateResult = changeTransactionSchema.safeParse(data);
  if (!validateResult.success) {
    return E.BAD_REQUEST();
  }
  await d.update(t).set({ amount: validateResult.data.amount, name: validateResult.data.name }).where(eq(t.id, validateResult.data.id));
});
const deleteTransaction = c(z$1.object({ id: z$1.string() }), async ({ id }) => {
  const transaction$1 = await d.delete(t).where(eq(t.id, id)).returning();
  if (transaction$1.length > 0) {
    await getTransactionByWeek(transaction$1[0].forWeek).refresh();
  }
});
const getTransactionByWeek = q(z$1.date(), async (date) => {
  const data = await d.select({
    amount: t.amount,
    forWeek: t.forWeek,
    id: t.id,
    name: t.name,
    paidAt: t.paidAt,
    user: t.user
  }).from(t).where(eq(t.forWeek, date));
  return data.sort((a, b) => a.paidAt.getTime() - b.paidAt.getTime());
});
const getAmountSpentByWeek = q(
  z$1.object({ forWeek: z$1.date(), timezone: z$1.string() }),
  async ({ forWeek, timezone }) => {
    const week = sql`${t.forWeek} AT TIME ZONE '${sql.raw(timezone)}'`.mapWith(
      t.forWeek
    );
    const result = await d.select({
      amount: sql`COALESCE(${sum(t.amount)}, '0')`
    }).from(t).groupBy(week).where(eq(t.forWeek, forWeek)).limit(1);
    if (result.length === 0) return { amount: "0" };
    return result[0];
  }
);
const getAmountSpentPerWeek = q(z$1.string(), async (timezone) => {
  const week = sql`${t.forWeek} AT TIME ZONE '${sql.raw(timezone)}'`.mapWith(
    t.forWeek
  );
  const result = await d.select({
    amount: sql`COALESCE(${sum(t.amount)}, '0')`,
    week
  }).from(t).groupBy(week);
  const groupedByYear = result.reduce(
    (acc, curr) => {
      const year = new Date(curr.week).getFullYear();
      const existingYear = acc.find((y) => y.year === year);
      if (existingYear) {
        existingYear.weeks.push({
          amount: curr.amount?.toString() || "0",
          week: new Date(curr.week)
        });
      } else {
        acc.push({
          weeks: [
            {
              amount: curr.amount?.toString() || "0",
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
  const sorted = groupedByYear.sort((a, b) => b.year - a.year).map((yearData) => ({
    ...yearData,
    weeks: yearData.weeks.sort((a, b) => b.week.getTime() - a.week.getTime())
  }));
  return sorted;
});
for (const [name, fn] of Object.entries({ changeTransaction, createNewTransaction, deleteTransaction, getAmountSpentByWeek, getAmountSpentPerWeek, getTransactionByWeek })) {
  fn.__.id = "18hyjm4/" + name;
  fn.__.name = name;
}
export {
  changeTransaction,
  createNewTransaction,
  deleteTransaction,
  getAmountSpentByWeek,
  getAmountSpentPerWeek,
  getTransactionByWeek
};
