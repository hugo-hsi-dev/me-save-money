<script>
	import {
		endOfWeek,
		getLocalTimeZone,
		parseDate,
		startOfWeek,
		today
	} from '@internationalized/date';
	import { page } from '$app/state';
	import { getBudgetByAppliesTo } from '$lib/remote/budget.remote';
	import { getAmountSpentByWeek } from '$lib/remote/transaction.remote';
	import { getSelectedWeek } from '$lib/state/selected-week.svelte';

	import { Badge } from './ui/badge';
	import { Skeleton } from './ui/skeleton';
	const selectedWeek = $derived(getSelectedWeek(page.url.searchParams));
	const timezone = getLocalTimeZone();

	// [TODO] Change both of these queries to use svelte:boundary
	// Wait for this issue to resolve: https://github.com/sveltejs/kit/issues/14113
	let amountSpentQuery = $derived(
		getAmountSpentByWeek({
			forWeek: selectedWeek.from.toDate(timezone),
			timezone
		})
	);

	let totalBudgetQuery = $derived(
		getBudgetByAppliesTo(selectedWeek.from.toDate(getLocalTimeZone()))
	);
</script>

<div class="my-12 flex flex-col gap-2">
	<span class="text-sm text-muted-foreground">Remaining Budget</span>

	{#if !amountSpentQuery.current}
		<Skeleton class="h-[60px] rounded" />
	{:else}
		<span class="text-6xl font-bold">
			{amountSpentQuery.current.amount}
		</span>
	{/if}

	{#if !totalBudgetQuery.current}
		<Skeleton class="h-[22px] rounded" />
	{:else}
		<Badge variant="outline">Total Budget ${totalBudgetQuery.current?.amount}</Badge>
	{/if}
</div>
