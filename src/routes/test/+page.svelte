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
			title: 'Grocery Shopping',
			price: 12.31,
			date: '2025-03-08',
			user: 'John Doe',
			status: 'ongoing' as const
		},
		{
			title: 'Monthly Rent Payment',
			price: 1250.0,
			date: '2025-03-01',
			user: 'Jane Smith',
			status: 'completed' as const
		},
		{
			title: 'Utility Bills',
			price: 89.45,
			date: '2025-03-15',
			user: 'Mike Johnson',
			status: 'pending' as const
		},
		{
			title: 'Coffee & Snacks',
			price: 24.67,
			date: '2025-03-07',
			user: 'Sarah Wilson',
			status: 'ongoing' as const
		}
	];
</script>

<div class="space-y-6 p-8">
	<h1 class="mb-6 text-2xl font-bold">Budget Cards Demo</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each budgetItems as item}
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
