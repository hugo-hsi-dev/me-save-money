<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	import FormAmountField from '../form-fields/form-amount-field.svelte';
	import FormNameField from '../form-fields/form-name-field.svelte';
	import { Button } from '../ui/button';
	import PresetAddForm from './preset-add-form.svelte';

	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button {...props} class=""><PlusIcon />Create Preset</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content class="border-none bg-transparent">
		<!-- BG Override -->
		<div class="mt-2 rounded-t-3xl border-t bg-background">
			<PresetAddForm bind:drawerOpen={open}>
				<!-- New Header Container -->
				<div class="flex items-center justify-between p-2 pt-3">
					<Drawer.Close>
						{#snippet child({ props })}
							<Button variant="link" type="button" class="text-lg" {...props}>Cancel</Button>
						{/snippet}
					</Drawer.Close>
					<span class="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold"
						>Create Preset</span
					>
					<Button variant="link" class="text-lg font-bold" type="submit">Done</Button>
				</div>
				<div class="mb-6 flex flex-col gap-6 px-6">
					<FormAmountField />
					<FormNameField />
					<div class="mb-[800px]"></div>
				</div>
			</PresetAddForm>
		</div>
	</Drawer.Content>
</Drawer.Root>
