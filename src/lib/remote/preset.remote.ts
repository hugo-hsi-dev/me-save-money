import { command, query } from '$app/server';
import { DBService } from '$lib/server/service/db';
import z from 'zod';

export const getPresets = query(async () => {
	const dbService = new DBService();
	return dbService.getPresets();
});

export const changePreset = command(
	z.object({ amount: z.string(), id: z.string(), name: z.string() }),
	async ({ amount, id, name }) => {
		const dbService = new DBService();
		await dbService.updatePreset({ amount, id, name });
		await getPresets().refresh();
	}
);

export const deletePreset = command(z.object({ id: z.string() }), async ({ id }) => {
	const dbService = new DBService();
	await dbService.deletePreset(id);
	await getPresets().refresh();
});
