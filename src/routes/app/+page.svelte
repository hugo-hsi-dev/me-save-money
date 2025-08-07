<script lang="ts">
	import AddTransactionDrawer from '$lib/components/add-transaction-drawer.svelte';
	import RemainingBudget from '$lib/components/remaining-budget.svelte';
	import TotalBudget from '$lib/components/total-budget.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
</script>

<div class="my-12 flex flex-col gap-2">
	<RemainingBudget />
	<TotalBudget />
</div>

<TransactionList />

<AddTransactionDrawer />
