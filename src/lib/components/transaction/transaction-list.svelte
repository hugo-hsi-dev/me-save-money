<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getTransactionByWeek } from '$lib/remote/transaction.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';

	import { Badge } from '../ui/badge';
	import { Skeleton } from '../ui/skeleton';

	type Transaction = {
		amount: string;
		id: string;
		name: string;
		paidAt: Date;
		user: string;
	};

	// [TODO] Change this query to use svelte:boundary and await
	// Wait for this issue to resolve: https://github.com/sveltejs/kit/issues/14113
	const selectedWeek = getSelectedWeekContext();

	let query = $derived(getTransactionByWeek(selectedWeek.nativeDate));
</script>

{#if !query.current}
	<ul class="flex flex-col gap-2">
		{#each { length: 3 }}
			<li>
				<Skeleton class="h-[178px] rounded-xl" />
			</li>
		{/each}
	</ul>
{:else}
	<ul class="flex flex-col gap-2">
		{#each query.current as transaction (transaction.id)}
			{@render card(transaction)}
		{/each}
	</ul>
{/if}

{#snippet card({ amount, name, paidAt, user }: Transaction)}
	<li>
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-muted-foreground">{name}</Card.Title>
			</Card.Header>
			<Card.Content>
				<span class="text-3xl font-semibold">${amount}</span>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Badge>{user}</Badge>
				<span class="text-xs text-muted-foreground">
					{paidAt.toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric'
					})} at {paidAt.toLocaleTimeString('en-US', {
						hour: 'numeric',
						hour12: true,
						minute: '2-digit'
					})}
				</span>
			</Card.Footer>
		</Card.Root>
	</li>
{/snippet}
