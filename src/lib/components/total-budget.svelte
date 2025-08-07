<script lang="ts">
	import { getBudgetByAppliesTo } from '$lib/remote/budget.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';

	import { Badge } from './ui/badge';
	import { Skeleton } from './ui/skeleton';

	const selectedWeek = getSelectedWeekContext();

	// [TODO] Change this query to use svelte:boundary and await
	// Wait for this issue to resolve: https://github.com/sveltejs/kit/issues/14113
	let query = $derived(getBudgetByAppliesTo(selectedWeek.nativeDate));
</script>

{#if !query.current}
	<Skeleton class="h-[22px] rounded" />
{:else}
	<Badge variant="outline">Total Budget ${query.current.amount}</Badge>
{/if}
