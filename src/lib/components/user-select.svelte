<script lang="ts">
	import { isHttpError } from '@sveltejs/kit';
	import * as Select from '$lib/components/ui/select';
	import { type User, USER_CONFIG } from '$lib/config';
	import { changeUser, getUser } from '$lib/remote/user.remote';

	import { Button } from './ui/button';
	import { Skeleton } from './ui/skeleton';
</script>

<svelte:boundary
	onerror={(e) => {
		if (!isHttpError(e)) {
			throw e;
		}
		if (e.status === 401) {
			throw e;
		}
	}}
>
	<Select.Root
		type="single"
		value={await getUser()}
		onValueChange={async (newValue) => {
			await changeUser({ user: newValue as User }).updates(
				getUser().withOverride(() => newValue as User)
			);
		}}
	>
		<Select.Trigger class="w-[120px]">{await getUser()}</Select.Trigger>
		<Select.Content>
			{#each USER_CONFIG as user, index (index)}
				<Select.Item value={user}>{user}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	{#snippet pending()}
		<Skeleton class="h-[36px] w-[120px]" />
	{/snippet}
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#snippet failed(_, r)}
		<Button variant="destructive" onclick={r} class="h-[36px] w-[120px]">Retry</Button>
	{/snippet}
</svelte:boundary>
