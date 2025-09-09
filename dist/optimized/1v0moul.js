import '../chunks/event-state.js';
import '@sveltejs/kit';
import '../chunks/form.js';
import '../chunks/query.js';
import { g, c } from '../chunks/budget.remote.js';
import { c as c2, g as g2 } from '../chunks/budget.remote.js';
import '../chunks/errors.js';
import '../chunks/index3.js';
import 'drizzle-orm';
import 'zod';
import '../chunks/command.js';
import '../chunks/false.js';
import '../chunks/paths.js';
import '../chunks/shared.js';
for (const [name, fn] of Object.entries({ changeBudget: c, getBudgetByAppliesTo: g })) {
	fn.__.id = '1v0moul/' + name;
	fn.__.name = name;
}
export { c2 as changeBudget, g2 as getBudgetByAppliesTo };
