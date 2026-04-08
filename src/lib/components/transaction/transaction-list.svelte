<script lang="ts">
	import { getTransactionIdsByWeek } from '$lib/remote/transaction.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';

	import { Skeleton } from '../ui/skeleton';
	import TransactionCard from './transaction-card.svelte';

	// [TODO] Change this query to use svelte:boundary and await
	// Wait for this issue to resolve: https://github.com/sveltejs/kit/issues/14113
	const selectedWeek = getSelectedWeekContext();

	let query = $derived(getTransactionIdsByWeek(selectedWeek.nativeDate));
</script>

{#if !query.ready}
	<ul class="flex flex-col gap-2">
		{#each { length: 3 }}
			<li>
				<Skeleton class="h-[178px] rounded-xl" />
			</li>
		{/each}
	</ul>
{:else if query.current.length <= 0}
	<p class="text-center font-thin text-muted-foreground">No transactions found...</p>
{:else}
	<ul class="flex flex-col gap-2">
		{#each query.current as transaction (transaction.id)}
			<TransactionCard id={transaction.id} />
		{/each}
	</ul>
{/if}
