<script lang="ts">
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	import DotIcon from '@lucide/svelte/icons/dot';

	let {
		children,
		ref = $bindable(null),
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="input-otp-separator" role="separator" {...restProps}>
	{#if children}
		{@render children?.()}
	{:else}
		<DotIcon />
	{/if}
</div>
