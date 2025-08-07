<script lang="ts">
	import type { Snippet } from 'svelte';

	import PencilIcon from '@lucide/svelte/icons/pencil';
	import * as ContextMenu from '$lib/components/ui/context-menu';

	import EditBudgetDrawer from './edit-budget-drawer.svelte';

	let open = $state(false);

	let {
		child
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
	} = $props();
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger {child}></ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Label>Total Budget</ContextMenu.Label>
		<ContextMenu.Separator />

		<ContextMenu.Item onclick={() => (open = true)}>
			<PencilIcon />
			Edit</ContextMenu.Item
		>
	</ContextMenu.Content>
</ContextMenu.Root>

<EditBudgetDrawer bind:open />
