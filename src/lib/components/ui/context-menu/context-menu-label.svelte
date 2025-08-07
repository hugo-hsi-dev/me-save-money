<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		children,
		class: className,
		inset,
		ref = $bindable(null),
		...restProps
	}: {
		inset?: boolean;
	} & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="context-menu-label"
	data-inset={inset}
	class={cn('px-2 py-1.5 text-sm font-medium text-foreground data-[inset]:pl-8', className)}
	{...restProps}
>
	{@render children?.()}
</div>
