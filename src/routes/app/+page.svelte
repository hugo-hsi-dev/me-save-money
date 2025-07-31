<script>
	import { getUser } from '$lib/remote/user.remote';
</script>

<svelte:boundary>
	<h1>{await getUser()}</h1>
	{#snippet pending()}
		loading...
	{/snippet}
</svelte:boundary>
