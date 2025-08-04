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
			id: 0,
			date: '2025-03-08',
			price: 12.31,
			status: 'ongoing' as const,
			title: 'Grocery Shopping',
			user: 'John Doe'
		},
		{
			id: 1,
			date: '2025-03-01',
			price: 1250.0,
			status: 'completed' as const,
			title: 'Monthly Rent Payment',
			user: 'Jane Smith'
		},
		{
			id: 2,
			date: '2025-03-15',
			price: 89.45,
			status: 'pending' as const,
			title: 'Utility Bills',
			user: 'Mike Johnson'
		},
		{
			id: 3,
			date: '2025-03-07',
			price: 24.67,
			status: 'ongoing' as const,
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
				status={item.status}
				onEdit={() => handleEdit(item.title)}
				onDelete={() => handleDelete(item.title)}
			/>
		{/each}
	</div>
</div>
