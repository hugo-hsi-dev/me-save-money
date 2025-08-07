<script lang="ts">
	import { asset } from '$app/paths';

	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="manifest" href={asset('/manifest-demo.json')} />
</svelte:head>

{@render children()}
