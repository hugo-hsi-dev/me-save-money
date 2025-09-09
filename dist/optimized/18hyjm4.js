import '../chunks/event-state.js';
import '../chunks/command.js';
import '../chunks/form.js';
import '@sveltejs/kit';
import '../chunks/query.js';
import { a, e, g, d, c, b } from '../chunks/transaction.remote.js';
import {
	b as b2,
	c as c2,
	d as d2,
	g as g2,
	e as e2,
	a as a2
} from '../chunks/transaction.remote.js';
import '../chunks/errors.js';
import '../chunks/index3.js';
import 'drizzle-orm';
import 'nanoid';
import 'zod';
import '../chunks/false.js';
import '../chunks/paths.js';
import '../chunks/shared.js';
for (const [name, fn] of Object.entries({
	changeTransaction: b,
	createNewTransaction: c,
	deleteTransaction: d,
	getAmountSpentByWeek: g,
	getAmountSpentPerWeek: e,
	getTransactionByWeek: a
})) {
	fn.__.id = '18hyjm4/' + name;
	fn.__.name = name;
}
export {
	b2 as changeTransaction,
	c2 as createNewTransaction,
	d2 as deleteTransaction,
	g2 as getAmountSpentByWeek,
	e2 as getAmountSpentPerWeek,
	a2 as getTransactionByWeek
};
