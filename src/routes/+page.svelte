<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { signIn } from '$lib/remote/auth.remote';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	let value: string = $state('');
	let isInvalid = $state(false);
</script>

<InputOTP.Root
	bind:value
	maxlength={6}
	pattern={REGEXP_ONLY_DIGITS}
	onComplete={async () => {
		try {
			const result = await signIn({ pin: value });
			if (result.ok) {
				goto(resolve('/app'));
			}
		} catch {
			isInvalid = true;
		}
	}}
>
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells as cell, index (index)}
				<InputOTP.Slot aria-invalid={isInvalid} {cell} />
			{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>
