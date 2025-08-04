<script lang="ts">
	import TransactionCard from '$lib/components/transaction-card.svelte';

	const handleEdit = (title: string) => {
		console.log(`Edit clicked for: ${title}`);
	};

	const handleDelete = (title: string) => {
		console.log(`Delete clicked for: ${title}`);
	};

	const budgetItems = [
		{
			date: '2025-03-08',
			id: 0,
			price: 12.31,
			title: 'Grocery Shopping',
			user: 'John Doe'
		},
		{
			date: '2025-03-01',
			id: 1,
			price: 1250.0,
			title: 'Monthly Rent Payment',
			user: 'Jane Smith'
		},
		{
			date: '2025-03-15',
			id: 2,
			price: 89.45,
			title: 'Utility Bills',
			user: 'Mike Johnson'
		},
		{
			date: '2025-03-07',
			id: 3,
			price: 24.67,
			title: 'Coffee & Snacks',
			user: 'Sarah Wilson'
		}
	];
</script>

<div class="space-y-6 p-8">
	<h1 class="mb-6 text-2xl font-bold">Budget Cards Demo</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each budgetItems as item (item.id)}
			<TransactionCard
				title={item.title}
				price={item.price}
				date={item.date}
				user={item.user}
				onEdit={() => handleEdit(item.title)}
				onDelete={() => handleDelete(item.title)}
			/>
		{/each}
	</div>
</div>
