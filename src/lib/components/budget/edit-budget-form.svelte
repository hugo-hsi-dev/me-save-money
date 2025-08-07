<script lang="ts" module>
	export const changeBudgetSchema = z.object({
		amount: z.string().refine((amount) => !isNaN(Number(amount))),
		appliesTo: z.string().transform((input) => new Date(input))
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import { changeBudget, getBudgetByAppliesTo } from '$lib/remote/budget.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';
	import z from 'zod';
	let {
		children,
		drawerOpen = $bindable()
	}: { children: Snippet; drawerOpen: boolean; id?: string } = $props();

	const selectedWeek = getSelectedWeekContext();
</script>

<form
	{...changeBudget.enhance(async ({ submit }) => {
		try {
			// Client side form validation...
			await submit().updates(getBudgetByAppliesTo(selectedWeek.nativeDate));
			drawerOpen = false;
		} catch {
			console.error('something went wrong');
		}
	})}
>
	<input type="hidden" name="appliesTo" value={selectedWeek.nativeDate} />
	{@render children()}
</form>
