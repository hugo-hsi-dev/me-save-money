<script lang="ts" module>
	export const addTransactionSchema = z.object({
		amount: z
			.string()
			.min(1)
			.refine((amount) => !isNaN(Number(amount))),
		name: z.string().min(3, 'Transaction name must be at least 3 characters long'),
		paidAt: z.string().transform((input) => new Date(input))
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import { sleep } from '$lib';
	import { createNewTransaction } from '$lib/remote/transaction.remote';
	import z from 'zod';
	let {
		children,
		drawerOpen = $bindable()
	}: { children: Snippet<[{ supererror: undefined | z.core.$ZodIssue[] }]>; drawerOpen: boolean } =
		$props();
	let error = $state<undefined | z.core.$ZodIssue[]>();
	let submitted = $state(false);
	let loading = $state(false);
	$effect(() => {
		if (submitted) error = createNewTransaction.result?.error;
	});
	$effect(() => {
		if (!error && submitted) drawerOpen = false;
	});
	$effect(() => {
		if (!drawerOpen) {
			error = undefined;
			submitted = false;
		}
	});
</script>

<div class="relative w-full pb-32">
	<!-- Loading Overlay -->
	{#if loading}
		<div
			class="bg-opacity-50 absolute inset-0 z-10 flex h-full items-center justify-center rounded-t-3xl bg-gray-200"
		>
			<div class="rounded-full bg-white p-4 shadow-lg">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
			</div>
		</div>
	{/if}
	<form
		{...createNewTransaction.enhance(async ({ submit }) => {
			try {
				loading = true;
				await submit();
				submitted = true;
			} finally {
				loading = false;
			}
		})}
	>
		{@render children({ supererror: error })}
	</form>
</div>
