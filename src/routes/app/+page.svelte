<script lang="ts">
	import type { User } from '$lib/config';

	import * as Select from '$lib/components/ui/select/index.js';
	import { USER_CONFIG } from '$lib/config';
	import { changeUser, getUser } from '$lib/remote/user.remote';
</script>

<svelte:boundary>
	<Select.Root
		type="single"
		value={await getUser()}
		onValueChange={async (newValue) => {
			await changeUser({ user: newValue as User }).updates(
				getUser().withOverride(() => newValue as User)
			);
		}}
	>
		<Select.Trigger class="w-[180px]">{await getUser()}</Select.Trigger>
		<Select.Content>
			{#each USER_CONFIG as user, index (index)}
				<Select.Item value={user}>{user}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	{#snippet pending()}
		loading...
	{/snippet}
</svelte:boundary>
