import { command, form, query } from '$app/server';
import { addPresetSchema } from '$lib/components/presets/preset-add-form.svelte';
import { changePresetSchema } from '$lib/components/presets/preset-change-form.svelte';
import { ERRORS } from '$lib/server/errors';
import { DBService } from '$lib/server/service/db';
import z from 'zod';

export const getPresets = query(async () => {
	const dbService = new DBService();
	return dbService.selectPresets();
});

export const createPreset = form(async (formData) => {
	const rawData = Object.fromEntries(formData.entries());
	const result = addPresetSchema.safeParse(rawData);

	if (!result.success) {
		return ERRORS.BAD_REQUEST;
	}

	const dbService = new DBService();

	await dbService.insertPreset({ ...result.data });
	await getPresets().refresh();
});

export const changePreset = form(async (formData) => {
	const rawData = Object.fromEntries(formData.entries());
	const result = changePresetSchema.safeParse(rawData);

	if (!result.success) {
		return ERRORS.INTERNAL_SERVER_ERROR;
	}

	const dbService = new DBService();
	await dbService.updatePreset({ ...result.data });
	await getPresets().refresh();
});

export const deletePreset = command(z.object({ id: z.string() }), async ({ id }) => {
	const dbService = new DBService();
	await dbService.deletePreset(id);
	await getPresets().refresh();
});
