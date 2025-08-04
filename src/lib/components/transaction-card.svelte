<script lang="ts">
	import { formatRelativeDate } from '$lib';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import Edit from '@lucide/svelte/icons/edit';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	interface Props {
		date: string;
		onDelete?: () => void;
		onEdit?: () => void;
		price: number;
		status?: 'completed' | 'ongoing' | 'pending';
		title: string;
		user: string;
	}

	let { date, onDelete, onEdit, price, status = 'ongoing', title, user }: Props = $props();

	const formatPrice = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			currency: 'USD',
			style: 'currency'
		}).format(amount);
	};

	const formattedPrice = $derived(formatPrice(price));
	const formattedDate = $derived(formatRelativeDate(date));
</script>

<Card class="w-full max-w-sm p-4">
	<CardContent class="space-y-4 p-0">
		<!-- Header with title and action buttons -->
		<div class="flex items-start justify-between">
			<h3 class="truncate text-sm font-medium text-muted-foreground">{title}</h3>

			<div class="ml-2 flex items-center gap-1">
				<Button variant="ghost" size="sm" class="h-8 w-8 p-0 hover:bg-muted" onclick={onEdit}>
					<Edit class="h-4 w-4 text-muted-foreground" />
					<span class="sr-only">Edit</span>
				</Button>
				<Button variant="ghost" size="sm" class="h-8 w-8 p-0 hover:bg-muted" onclick={onDelete}>
					<Trash2 class="h-4 w-4 text-muted-foreground" />
					<span class="sr-only">Delete</span>
				</Button>
			</div>
		</div>

		<!-- Price display -->
		<div class="py-2">
			<span class="text-2xl font-bold text-foreground">{formattedPrice}</span>
		</div>

		<!-- Footer with status and date -->
		<div class="flex items-center justify-between">
			<Badge class="px-2 py-1 text-xs">
				by {user}
			</Badge>
			<span class="text-sm text-muted-foreground">{formattedDate}</span>
		</div>
	</CardContent>
</Card>
