<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import { Button, type ButtonProps } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils.js';

	type MobileLinkProps = {
		content?: string;
	} & HTMLAnchorAttributes;

	let { class: className, ...restProps }: ButtonProps = $props();

	let open = $state(false);

	const seed = [
		{
			weeks: [
				{
					href: '?week=asdf',
					startOfWeek: '1234'
				},
				{
					href: '?settings=user',
					startOfWeek: 'User Settings'
				},
				{
					href: '?month=xyz',
					startOfWeek: 'Monthly Report'
				}
			],
			year: 'asdf'
		},
		{
			weeks: [
				{
					href: '?month=xyz',
					startOfWeek: 'Monthly Report'
				}
			],
			year: 'Reports'
		},
		{
			weeks: [
				{
					href: '?dashboard=main',
					startOfWeek: 'Overview'
				}
			],
			year: 'Dashboard'
		},
		{
			weeks: [
				{
					href: '?settings=user',
					startOfWeek: 'User Settings'
				}
			],
			year: 'Settings'
		}
	];
</script>

{#snippet MobileLink({ class: className, content, href, ...props }: MobileLinkProps)}
	<a
		{href}
		onclick={() => {
			open = false;
		}}
		class={cn('text-2xl font-medium', className)}
		{...props}
	>
		{content}
	</a>
{/snippet}

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{...restProps}
				variant="ghost"
				class={cn(
					'extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent',
					className
				)}
			>
				<div class="relative flex h-8 w-4 items-center justify-center">
					<div class="relative size-4">
						<span
							class={cn(
								'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
								open ? 'top-[0.4rem] -rotate-45' : 'top-1'
							)}
						></span>
						<span
							class={cn(
								'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
								open ? 'top-[0.4rem] rotate-45' : 'top-2.5'
							)}
						></span>
					</div>
					<span class="sr-only">Toggle Menu</span>
				</div>
				<span class="flex h-8 items-center text-lg leading-none font-medium"> Me Save Money </span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		class="no-scrollbar h-(--bits-popover-content-available-height) w-(--bits-popover-content-available-width) overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur duration-100"
		align="start"
		side="bottom"
		alignOffset={-16}
		sideOffset={14}
		preventScroll
	>
		<div class="flex flex-col gap-12 overflow-auto px-6 py-6">
			<div class="flex flex-col gap-8">
				{#each seed as years (years.year)}
					<div class="flex flex-col gap-4">
						<div class="text-sm font-medium text-muted-foreground">
							{years.year}
						</div>
						<div class="flex flex-col gap-3">
							{#each years.weeks as week, i (i)}
								{@render MobileLink({ content: week.startOfWeek, href: week.href })}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
