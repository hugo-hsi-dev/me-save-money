<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createNewTransaction } from '$lib/remote/transaction.remote';
	import { nanoid } from 'nanoid';
	let { children, drawerOpen = $bindable() }: { children: Snippet; drawerOpen: boolean } = $props();
</script>

<form
	{...createNewTransaction.enhance(async ({ submit }) => {
		try {
			await submit();
			drawerOpen = false;
		} catch {
			console.error('something went wrong');
		}
	})}
>
	<input type="hidden" value={nanoid()} name="id" />
	{@render children()}
</form>
