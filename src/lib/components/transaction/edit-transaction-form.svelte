<script lang="ts" module>
	export const changeTransactionSchema = z.object({
		id: z.string(),
		amount: z.string().refine((amount) => !isNaN(Number(amount))),
		name: z.string()
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import { changeTransaction } from '$lib/remote/transaction.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';
	import z from 'zod';
	let {
		children,
		drawerOpen = $bindable()
	}: { children: Snippet; drawerOpen: boolean; id?: string } = $props();

	const selectedWeek = getSelectedWeekContext();
</script>

<form
	{...changeTransaction.enhance(async ({ submit }) => {
		try {
			// Client side form validation...
			// await submit().updates(getBudgetByAppliesTo(selectedWeek.nativeDate));
			await submit();
			drawerOpen = false;
		} catch {
			console.error('something went wrong');
		}
	})}
>
	<input type="hidden" name="appliesTo" value={selectedWeek.nativeDate} />
	{@render children()}
</form>
