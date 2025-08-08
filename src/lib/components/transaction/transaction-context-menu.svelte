<script lang="ts">
	import type { Snippet } from 'svelte';

	import PencilIcon from '@lucide/svelte/icons/pencil';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import EditTransactionDrawer, { type Transaction } from './edit-transaction-drawer.svelte';

	let open = $state(false);

	let {
		child,
		transaction
	}: {
		child?:
			| Snippet<
					[
						{
							props: Record<string, unknown>;
						}
					]
			  >
			| undefined;
			transaction: Transaction
	} = $props();
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger {child}></ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Label>Total Budget</ContextMenu.Label>
		<ContextMenu.Separator />

		<ContextMenu.Item onclick={() => (open = true)}>
			<PencilIcon />
			Edit Transaction</ContextMenu.Item
		>
	</ContextMenu.Content>
</ContextMenu.Root>

<EditTransactionDrawer bind:open {transaction}/>
