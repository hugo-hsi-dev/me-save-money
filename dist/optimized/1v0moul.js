import "../chunks/event-state.js";
import "@sveltejs/kit";
import { f } from "../chunks/form.js";
import { q } from "../chunks/query.js";
import z$1, { z } from "zod";
import { d, b } from "../chunks/index3.js";
import { E } from "../chunks/errors.js";
import { eq } from "drizzle-orm";
import "../chunks/command.js";
import "../chunks/false.js";
import "../chunks/paths.js";
import "../chunks/shared.js";
const changeBudgetSchema = z.object({
  amount: z.string().refine((amount) => !isNaN(Number(amount))),
  appliesTo: z.string().transform((input) => new Date(input))
});
const getBudgetByAppliesTo = q(z$1.date(), async (date) => {
  const result = await d.select({
    amount: b.amount,
    id: b.id
  }).from(b).where(eq(b.appliesTo, date)).limit(1);
  if (result.length === 0) {
    return { amount: "200.00" };
  }
  return result[0];
});
const changeBudget = f(async (formData) => {
  const data = Object.fromEntries(formData.entries());
  const validateResult = changeBudgetSchema.safeParse(data);
  if (!validateResult.success) {
    return E.BAD_REQUEST();
  }
  const insertResult = await d.insert(b).values(validateResult.data).onConflictDoUpdate({ set: validateResult.data, target: b.appliesTo }).returning();
  await getBudgetByAppliesTo(insertResult[0].appliesTo).refresh();
});
for (const [name, fn] of Object.entries({ changeBudget, getBudgetByAppliesTo })) {
  fn.__.id = "1v0moul/" + name;
  fn.__.name = name;
}
export {
  changeBudget,
  getBudgetByAppliesTo
};
