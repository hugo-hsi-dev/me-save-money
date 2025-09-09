<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';

	let { title }: { title: string } = $props();
</script>

<div class="flex items-center justify-between p-2 pt-3">
	<Drawer.Close>
		{#snippet child({ props })}
			<Button variant="link" type="button" class="text-lg" {...props}>Cancel</Button>
		{/snippet}
	</Drawer.Close>
	<span class="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold">{title}</span>
	<Button variant="link" class="text-lg font-bold" type="submit">Done</Button>
</div>
