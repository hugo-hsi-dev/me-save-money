<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Portal } from 'bits-ui';

	import { Button } from './ui/button';
</script>

<Drawer.Root>
	<Portal>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<Button {...props} class="fixed right-12 bottom-12 z-50 h-16 w-16 rounded-full"
					><PlusIcon /></Button
				>
			{/snippet}
		</Drawer.Trigger>
	</Portal>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
			<Drawer.Description>This action cannot be undone.</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Button>Submit</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
