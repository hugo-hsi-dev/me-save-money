<script>
	import { getUser } from '$lib/remote/auth.remote';
</script>

<svelte:boundary>
	<h1>{await getUser()}</h1>
	{#snippet pending()}
		loading...
	{/snippet}
</svelte:boundary>
