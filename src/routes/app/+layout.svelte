<script lang="ts">
	import AppHeader from '$lib/components/app-header.svelte';

	import type { LayoutProps } from '../$types';

	let { children }: LayoutProps = $props();
</script>

<div class="relative z-10 flex min-h-svh flex-col bg-background">
	<AppHeader />
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
</div>
