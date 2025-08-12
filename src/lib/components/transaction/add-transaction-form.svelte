<script lang="ts" module>
	export const addTransactionSchema = z.object({
		amount: z.string().min(1).refine((amount) => !isNaN(Number(amount))),
		name: z.string().min(3, "Transaction name must be at least 3 characters long"),
		paidAt: z.string().transform((input) => new Date(input))
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createNewTransaction } from '$lib/remote/transaction.remote';
	import z from 'zod';
	import { sleep } from '$lib';
	let { children, drawerOpen = $bindable() }: { children: Snippet<[{supererror: z.core.$ZodIssue[] | undefined}]>; drawerOpen: boolean } = $props();
	let error = $state<z.core.$ZodIssue[] | undefined>();
	let submitted = $state(false);
	let loading = $state(false);
	$effect(() => {
		if (submitted)
			error = createNewTransaction.result?.error;
	})
	$effect(() => {
		if (!drawerOpen) {
			error = undefined;
			submitted = false;
		}
	})
</script>

<div class="relative w-full pb-32">
    <!-- Loading Overlay -->
    {#if loading}
      <div class="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-t-3xl flex items-center justify-center z-10 h-full">
        <div class="bg-white rounded-full p-4 shadow-lg">
          <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    {/if}
	<form
		{...createNewTransaction.enhance(async ({submit})=> {
			try {
				loading = true;
				await sleep(2000);
				await submit();
				submitted = true;
			} finally {
				loading = false;
			}
		})}>
		
		{@render children({supererror: error})}
	</form>
</div>
