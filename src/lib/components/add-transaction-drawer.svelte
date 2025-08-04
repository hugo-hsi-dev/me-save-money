<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Portal } from 'bits-ui';

	import AddTransactionAmountField from './add-transaction-amount-field.svelte';
	import AddTransactionNameField from './add-transaction-name-field.svelte';
	import AddTransactionPaidAtField from './add-transaction-paid-at-field.svelte';
	import { Button } from './ui/button';
</script>

<Drawer.Root>
	<Portal>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<Button {...props} class="fixed right-12 bottom-12 z-50 h-16 w-16 rounded-full"
					><PlusIcon /></Button
				>
			{/snippet}
		</Drawer.Trigger>
	</Portal>
	<Drawer.Content class="border-none bg-transparent">
		<!-- BG Override -->
		<div class="mt-2 rounded-t-3xl border-t bg-background">
			<!-- New Header Container -->
			<div class="flex items-center justify-between p-2 pt-3">
				<Drawer.Close>
					{#snippet child({ props })}
						<Button variant="link" class="text-lg" {...props}>Cancel</Button>
					{/snippet}
				</Drawer.Close>
				<span class="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold"
					>New Transaction</span
				>
				<Button variant="link" class="text-lg font-bold">Done</Button>
			</div>
			<div class="mb-6 flex flex-col gap-6 px-6">
				<AddTransactionAmountField />
				<AddTransactionNameField />
				<AddTransactionPaidAtField />
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
