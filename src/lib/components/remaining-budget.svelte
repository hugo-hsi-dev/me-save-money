<script>
	import { getLocalTimeZone } from '@internationalized/date';
	import { page } from '$app/state';
	import { getBudgetByAppliesTo } from '$lib/remote/budget.remote';
	import { getAmountSpentByWeek } from '$lib/remote/transaction.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';

	import { Skeleton } from './ui/skeleton';
	const selectedWeek = getSelectedWeekContext();
	const timezone = getLocalTimeZone();

	// [TODO] Change this query to use svelte:boundary and await
	// Wait for this issue to resolve: https://github.com/sveltejs/kit/issues/14113
	let amountSpentQuery = $derived(
		getAmountSpentByWeek({
			forWeek: selectedWeek.calendarDate.toDate(timezone),
			timezone
		})
	);

	let totalBudgetQuery = $derived(
		getBudgetByAppliesTo(selectedWeek.calendarDate.toDate(getLocalTimeZone()))
	);
</script>

<span class="text-sm text-muted-foreground">Remaining Budget</span>

{#if !amountSpentQuery.current || !totalBudgetQuery.current}
	<Skeleton class="h-[60px] rounded" />
{:else}
	<span class="text-6xl font-bold">
		{Number(totalBudgetQuery.current.amount) - Number(amountSpentQuery.current.amount)}
	</span>
{/if}
