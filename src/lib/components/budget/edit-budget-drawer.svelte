<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';

	import FormAmountField from '../form-fields/form-amount-field.svelte';
	import PresetAddForm from '../presets/preset-add-form.svelte';
	import { Button } from '../ui/button';
	import EditBudgetForm from './edit-budget-form.svelte';

	let {
		open = $bindable()
	}: {
		open: boolean;
	} = $props();
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="border-none bg-transparent">
		<!-- BG Override -->
		<div class="mt-2 rounded-t-3xl border-t bg-background">
			<EditBudgetForm bind:drawerOpen={open}>
				<!-- New Header Container -->
				<div class="flex items-center justify-between p-2 pt-3">
					<Drawer.Close>
						{#snippet child({ props })}
							<Button variant="link" type="button" class="text-lg" {...props}>Cancel</Button>
						{/snippet}
					</Drawer.Close>
					<span class="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold"
						>Edit Total Budget</span
					>
					<Button variant="link" class="text-lg font-bold" type="submit">Done</Button>
				</div>
				<div class="mb-24 flex flex-col gap-6 px-6">
					<FormAmountField />
				</div>
			</EditBudgetForm>
		</div>
	</Drawer.Content>
</Drawer.Root>
