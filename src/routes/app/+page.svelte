<script lang="ts">
	import TotalBudget from '$lib/components/budget/total-budget.svelte';
	import RemainingBudget from '$lib/components/remaining-budget.svelte';
	import AddTransactionDrawer from '$lib/components/transaction/add-transaction-drawer.svelte';
	import TransactionList from '$lib/components/transaction/transaction-list.svelte';
</script>

<div class="my-12 flex flex-col gap-2">
	<RemainingBudget />
	<TotalBudget />
</div>
<div class="mb-10 space-y-2">
	<TransactionList />
</div>

<AddTransactionDrawer />
