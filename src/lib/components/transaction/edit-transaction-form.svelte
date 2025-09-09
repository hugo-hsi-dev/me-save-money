<script lang="ts">
	import type { Snippet } from 'svelte';

	import { changeTransaction } from '$lib/remote/transaction.remote';
	let {
		children,
		drawerOpen = $bindable(),
		id
	}: { children: Snippet; drawerOpen: boolean; id: string } = $props();
</script>

<form
	{...changeTransaction.enhance(async ({ submit }) => {
		try {
			// Client side form validation...
			// await submit().updates(getBudgetByAppliesTo(selectedWeek.nativeDate));
			await submit();
			drawerOpen = false;
		} catch (e) {
			console.error('something went wrong', e);
		}
	})}
>
	<input type="hidden" name="id" value={id} />
	{@render children()}
</form>
