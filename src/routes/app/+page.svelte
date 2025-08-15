<script lang="ts">
	import ChartBudgetUse from '$lib/components/budget/chart-budget-use.svelte';
	import RemainingBudget from '$lib/components/budget/remaining-budget.svelte';
	import TotalBudget from '$lib/components/budget/total-budget.svelte';
	import AddTransactionDrawer from '$lib/components/transaction/add-transaction-drawer.svelte';
	import TransactionList from '$lib/components/transaction/transaction-list.svelte';
</script>


<div class="my-4 flex flex-col gap-2">
	<div class="my-4 flex flex-col gap-2">
		<RemainingBudget />
		<TotalBudget />
	</div>
	<ChartBudgetUse />
</div>
<div class="mb-10 space-y-2">
	<TransactionList />
</div>

<AddTransactionDrawer />
