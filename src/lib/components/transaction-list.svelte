<script lang="ts">
	import { getLocalTimeZone } from '@internationalized/date';
	import * as Card from '$lib/components/ui/card';
	import { getTransactionByWeek } from '$lib/remote/transaction.remote';
	import { getSelectedWeek } from '$lib/state/selected-week.svelte';

	import { Badge } from './ui/badge';
	import { Skeleton } from './ui/skeleton';

	type Transaction = {
		amount: string;
		id: string;
		name: string;
		paidAt: Date;
		user: string;
	};

	const selectedWeek = getSelectedWeek();
</script>

<svelte:boundary>
	<ul class="flex flex-col gap-2">
		{#each await getTransactionByWeek(selectedWeek.from.toDate(getLocalTimeZone())) as transaction (transaction.id)}
			{@render card(transaction)}
		{/each}
	</ul>
	{#snippet pending()}
		<ul class="flex flex-col gap-2">
			{#each { length: 3 }}
				<li>
					<Skeleton class="h-[178px] rounded-xl" />
				</li>
			{/each}
		</ul>
	{/snippet}
</svelte:boundary>

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
