<script lang="ts" module>
	export const changePresetSchema = z.object({
		amount: z.string().refine((amount) => !isNaN(Number(amount))),
		id: z.string(),
		name: z.string()
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import { changePreset } from '$lib/remote/preset.remote';
	import z from 'zod';
	let { children, drawerOpen = $bindable() }: { children: Snippet; drawerOpen: boolean } = $props();
</script>

<form
	{...changePreset.enhance(async ({ submit }) => {
		try {
			// const data = Object.fromEntries(formData.entries());
			// const validatedData = addTransactionSchema.parse(data);
			await submit();
			drawerOpen = false;
		} catch {
			console.error('something went wrong');
		}
	})}
>
	{@render children()}
</form>
