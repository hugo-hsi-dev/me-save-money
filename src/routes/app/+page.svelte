<script lang="ts">
	import AddTransactionDrawer from '$lib/components/add-transaction-drawer.svelte';
	import RemainingBudget from '$lib/components/remaining-budget.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
</script>

<RemainingBudget />
<TransactionList />

<AddTransactionDrawer />
