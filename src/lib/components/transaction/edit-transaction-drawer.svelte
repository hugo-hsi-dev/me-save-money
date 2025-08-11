<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';

	import FormAmountField from '../reusable-fields/form-amount-field.svelte';
	import FormNameField from '../reusable-fields/form-name-field.svelte';
	import { Button } from '../ui/button';
	import EditTransactionForm from './edit-transaction-form.svelte';

	export type Transaction = {
		amount: string;
		name: string;
		id: string
	}

	let {
		open = $bindable(), transaction
	}: {
		open: boolean;
		transaction: Transaction
	} = $props();
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="border-none bg-transparent">
		<!-- BG Override -->
		<div class="mt-2 rounded-t-3xl border-t bg-background">
			<EditTransactionForm bind:drawerOpen={open} id={transaction.id}>
				<div class="flex items-center justify-between p-2 pt-3">
					<Drawer.Close>
						{#snippet child({ props })}
							<Button variant="link" type="button" class="text-lg" {...props}>Cancel</Button>
						{/snippet}
					</Drawer.Close>
					<span class="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold"
						>{transaction.name}</span
					>
					<Button variant="link" class="text-lg font-bold" type="submit">Done</Button>
				</div>
				<div class="mb-24 flex flex-col gap-6 px-6">
					<FormAmountField input={transaction.amount} />
					<FormNameField input={transaction.name} />
				</div>
			</EditTransactionForm>
		</div>
	</Drawer.Content>
</Drawer.Root>
