<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getTransactionByWeek } from '$lib/remote/transaction.remote';

	import { Badge } from './ui/badge';

	type Transaction = {
		amount: string;
		id: string;
		name: string;
		paidAt: Date;
		user: string;
	};
</script>

<svelte:boundary>
	<ul class="flex flex-col gap-2">
		{#each await getTransactionByWeek(new Date()) as transaction (transaction.id)}
			{@render card(transaction)}
		{/each}
	</ul>
	{#snippet pending()}
		loading...
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
