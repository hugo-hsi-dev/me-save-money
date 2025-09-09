<script lang="ts">
	import type { Snippet } from 'svelte';

	import ErrorText from './error-text.svelte';

	let {
		children,
		error
	}: {
		children: Snippet;
		error?: string;
	} = $props();
</script>

<div class="flex flex-col gap-3">
	{@render children()}
	<ErrorText {error} />
</div>
