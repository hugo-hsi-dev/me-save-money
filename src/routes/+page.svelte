<script>
	import { resolve } from '$app/paths';
	import SignInInput from '$lib/components/sign-in-input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
</script>

<div class="flex h-dvh w-screen flex-col items-center justify-center gap-12 bg-background p-12">
	<div class="flex w-full max-w-md flex-col items-center gap-6">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-4">
				<div>
					<h1 class="text-2xl leading-6 font-semibold tracking-tight">Sign in with PIN</h1>
					<p class="mt-2 text-sm text-muted-foreground">Enter your PIN to access your account</p>
				</div>
				<SignInInput />
			</div>

			<div class="flex items-center gap-6">
				<Separator class="flex-1" />
				<span class="text-xs text-muted-foreground"> Or </span>
				<Separator class="flex-1" />
			</div>

			<Button variant="outline" size="lg" href={resolve('/demo')}>View Demo</Button>
		</div>
	</div>
</div>
