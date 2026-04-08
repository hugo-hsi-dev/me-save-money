<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getTransactionsById } from '$lib/remote/transaction.remote';

	import { Badge } from '../ui/badge';
	import { Skeleton } from '../ui/skeleton';
	import TransactionContextMenu from './transaction-context-menu.svelte';

	type Props = {
		id: string;
	};

	let { id }: Props = $props();

	let query = $derived(getTransactionsById(id));
</script>

{#if !query.current}
	<li>
		<Skeleton class="h-[178px] rounded-xl" />
	</li>
{:else}
	<TransactionContextMenu transaction={query.current}>
		{#snippet child({ props })}
			<li {...props}>
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-muted-foreground">{query.current!.name}</Card.Title>
					</Card.Header>
					<Card.Content>
						<span class="text-3xl font-semibold">${query.current!.amount}</span>
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Badge>{query.current!.user}</Badge>
						<span class="text-xs text-muted-foreground">
							{query.current!.paidAt.toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})} at {query.current!.paidAt.toLocaleTimeString('en-US', {
								hour: 'numeric',
								hour12: true,
								minute: '2-digit'
							})}
						</span>
					</Card.Footer>
				</Card.Root>
			</li>
		{/snippet}
	</TransactionContextMenu>
{/if}
