<script lang="ts">
	let { error }: { error?: string } = $props();
</script>

{#if error}
	<p class="font-thin text-destructive">{error}</p>
{/if}
