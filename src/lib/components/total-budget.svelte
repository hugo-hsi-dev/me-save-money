<script lang="ts">
	import { getLocalTimeZone } from '@internationalized/date';
	import { page } from '$app/state';
	import { getBudgetByAppliesTo } from '$lib/remote/budget.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';

	import { Badge } from './ui/badge';
	import { Skeleton } from './ui/skeleton';

	const selectedWeek = getSelectedWeekContext();

	// [TODO] Change this query to use svelte:boundary and await
	// Wait for this issue to resolve: https://github.com/sveltejs/kit/issues/14113
	let totalBudgetQuery = $derived(
		getBudgetByAppliesTo(selectedWeek.calendarDate.toDate(getLocalTimeZone()))
	);
</script>

{#if !totalBudgetQuery.current}
	<Skeleton class="h-[22px] rounded" />
{:else}
	<Badge variant="outline">Total Budget ${totalBudgetQuery.current.amount}</Badge>
{/if}
