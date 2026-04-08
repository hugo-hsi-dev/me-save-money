<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { getTransactionsById } from '$lib/remote/transaction.remote';

	import FormAmountField from '../reusable-fields/form-amount-field.svelte';
	import FormNameField from '../reusable-fields/form-name-field.svelte';
	import { Button } from '../ui/button';
	import { Skeleton } from '../ui/skeleton';
	import EditTransactionForm from './edit-transaction-form.svelte';

	let {
		id,
		open = $bindable()
	}: {
		id: string;
		open: boolean;
	} = $props();

	let query = $derived(getTransactionsById(id));
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="border-none bg-transparent">
		<!-- BG Override -->
		<div class="mt-2 rounded-t-3xl border-t bg-background">
			<EditTransactionForm bind:drawerOpen={open} {id}>
				<div class="flex items-center justify-between p-2 pt-3">
					<Drawer.Close>
						{#snippet child({ props })}
							<Button variant="link" type="button" class="text-lg" {...props}>Cancel</Button>
						{/snippet}
					</Drawer.Close>
					{#if !query.current}
						<Skeleton />
					{:else}
						<span class="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold"
							>{query.current.name}</span
						>
					{/if}

					<Button variant="link" class="text-lg font-bold" type="submit">Done</Button>
				</div>
				<div class="mb-24 flex flex-col gap-6 px-6">
					{#if !query.current}
						<Skeleton />
					{:else}
						<FormAmountField input={query.current.amount} />
					{/if}

					{#if !query.current}
						<Skeleton />
					{:else}
						<FormNameField input={query.current.name} />
					{/if}
				</div>
			</EditTransactionForm>
		</div>
	</Drawer.Content>
</Drawer.Root>
