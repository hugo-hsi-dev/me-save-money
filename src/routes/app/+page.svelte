<script lang="ts">
	import { isHttpError } from '@sveltejs/kit';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:boundary>
	{#snippet failed(error, reset)}
		{#if isHttpError(error)}
			<div class="h-dvh w-screen p-12">
				<div class="flex h-full flex-col justify-center gap-6 rounded-3xl border border-dashed p-6">
					<span class="text-3xl font-bold">
						{error.body.message}
					</span>
					{#if error.status === 401}
						<Button class="w-fit" href={resolve('/')}>Sign In</Button>
					{:else}
						<Button class="w-fit" onclick={reset}>Try Again</Button>
					{/if}
				</div>
			</div>
		{:else}
			<div class="h-dvh w-screen p-12">
				<div class="flex h-full flex-col justify-center gap-6 rounded-3xl border border-dashed p-6">
					<span class="text-3xl font-bold"> An unknown error has occured </span>
					<Button class="w-fit" onclick={reset}>Try Again</Button>
				</div>
			</div>
		{/if}
	{/snippet}
</svelte:boundary>
