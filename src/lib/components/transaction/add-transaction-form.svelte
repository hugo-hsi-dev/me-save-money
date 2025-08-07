<script lang="ts" module>
	export const addTransactionSchema = z.object({
		amount: z.string().refine((amount) => !isNaN(Number(amount))),
		id: z.nanoid(),
		name: z.string(),
		paidAt: z.string().transform((input) => new Date(input))
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createNewTransaction } from '$lib/remote/transaction.remote';
	import { nanoid } from 'nanoid';
	import z from 'zod';
	let { children, drawerOpen = $bindable() }: { children: Snippet; drawerOpen: boolean } = $props();
</script>

<form
	{...createNewTransaction.enhance(async ({ submit }) => {
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
	<input type="hidden" value={nanoid()} name="id" />
	{@render children()}
</form>
