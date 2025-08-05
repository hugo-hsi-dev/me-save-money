import { command, form, query } from '$app/server';
import { addPresetSchema } from '$lib/components/presets/preset-add-form.svelte';
import { ERRORS } from '$lib/server/errors';
import { DBService } from '$lib/server/service/db';
import z from 'zod';

export const getPresets = query(async () => {
	const dbService = new DBService();
	return dbService.selectPresets();
});

export const createPreset =  form(async (formData) => {
	const rawData = Object.fromEntries(formData.entries());
	const result = addPresetSchema.safeParse(rawData);

	if (!result.success) {
		return ERRORS.INTERNAL_SERVER_ERROR;
	}

	const dbService = new DBService();

	await dbService.insertPreset({ ...result.data });
	await getPresets().refresh();
});

// command(
// 	z.object({ amount: z.string(), name: z.string() }),
// 	async ({ amount, name }) => {
// 		const dbService = new DBService();
// 		const newPreset = await dbService.insertPreset({ amount, name });
// 		await getPresets().refresh();
// 		return newPreset;
// 	}
// );

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
