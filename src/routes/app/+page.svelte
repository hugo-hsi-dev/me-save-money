<script lang="ts">
	import AddTransactionDrawer from '$lib/components/add-transaction-drawer.svelte';
	import PresetAddDrawer from '$lib/components/presets/preset-add-drawer.svelte';
	import PresetList from '$lib/components/presets/preset-list.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
</script>

<div class="mb-10 space-y-2">
	<PresetAddDrawer />
	<PresetList />
	<TransactionList />
	<AddTransactionDrawer />
</div>
