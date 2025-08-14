<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { deleteTransaction, getTransactionByWeek } from '$lib/remote/transaction.remote';
	import { getSelectedWeekContext } from '$lib/state/selected-week.svelte';
	let {
		id,
		name,
		open = $bindable()
	}: { forWeek: Date; id: string; name: string; open: boolean } = $props();
	const selectedWeek = getSelectedWeekContext();

	const deleteIt = async () => {
		await deleteTransaction({ id }).updates(getTransactionByWeek(selectedWeek.nativeDate));
		open = false;
	};
</script>

<Dialog.Root
	{open}
	onOpenChange={() => {
		open = !open;
	}}
>
	<Dialog.Content class="max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Delete Transaction | {name}</Dialog.Title>
			<Dialog.Description>
				Deleting this transaction is permanent and cannot be undone!
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				variant="link"
				onclick={() => {
					open = false;
				}}>Cancel</Button
			>
			<Button
				variant="link"
				class="text-destructive"
				onclick={() => {
					deleteIt();
				}}>Delete</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
