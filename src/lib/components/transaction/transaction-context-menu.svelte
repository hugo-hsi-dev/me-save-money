<script lang="ts">
	import type { Snippet } from 'svelte';

	import PencilIcon from '@lucide/svelte/icons/pencil';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import * as ContextMenu from '$lib/components/ui/context-menu';

	import type { Transaction } from './transaction-list.svelte';

	import DeleteTransactionDialog from './delete-transaction-dialog.svelte';
	import EditTransactionDrawer from './edit-transaction-drawer.svelte';

	let openEdit = $state(false);
	let openDelete = $state(false);

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
		transaction: Transaction;
	} = $props();
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger {child}></ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Label>{transaction.name}</ContextMenu.Label>
		<ContextMenu.Separator />

		<ContextMenu.Item onclick={() => (openEdit = true)}>
			<PencilIcon />
			Edit</ContextMenu.Item
		>
		<ContextMenu.Item onclick={() => (openDelete = true)}>
			<TrashIcon />Delete
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>

<EditTransactionDrawer bind:open={openEdit} {transaction} />
<DeleteTransactionDialog bind:open={openDelete} {...transaction} />
