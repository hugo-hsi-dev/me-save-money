<script lang="ts">
	import AddTransactionDrawer from '$lib/components/add-transaction-drawer.svelte';
	import TotalBudget from '$lib/components/budget/total-budget.svelte';
	import PresetAddDrawer from '$lib/components/presets/preset-add-drawer.svelte';
	import PresetSelect from '$lib/components/presets/preset-select.svelte';
	import RemainingBudget from '$lib/components/remaining-budget.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="my-12 flex flex-col gap-2">
	<RemainingBudget />
	<TotalBudget />
</div>
<div class="mb-10 space-y-2">
	<PresetAddDrawer />
	<PresetSelect presets={data.presets} />
	<TransactionList />
</div>

<AddTransactionDrawer />
