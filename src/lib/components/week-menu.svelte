<script lang="ts">
	import {
		CalendarDate,
		endOfWeek,
		getLocalTimeZone,
		startOfWeek,
		today
	} from '@internationalized/date';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { getAmountSpentPerWeek } from '$lib/remote/transaction.remote';
	import { getSelectedWeek } from '$lib/state/selected-week.svelte';
	import { cn } from '$lib/utils.js';

	import { Skeleton } from './ui/skeleton';

	let open = $state(false);

	const selectedWeek = getSelectedWeek();
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				class="extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent"
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
				<svelte:boundary>
					{#each await getAmountSpentPerWeek(getLocalTimeZone()) as years (years.year)}
						<div class="flex flex-col gap-4">
							<div class="text-sm font-medium text-muted-foreground">
								{years.year}
							</div>
							<div class="flex flex-col gap-3">
								{#each years.weeks as week, i (i)}
									{@const calendarDate = new CalendarDate(
										week.week.getUTCFullYear(),
										week.week.getUTCMonth() + 1,
										week.week.getUTCDate()
									)}
									{@const middleOfWeek = calendarDate.add({ days: 4 })}
									{@const from = startOfWeek(middleOfWeek, getLocalTimeZone(), 'mon')}
									{@const to = endOfWeek(middleOfWeek, getLocalTimeZone(), 'mon')}
									<a
										href="?from={from.toString()}&to={to.toString()}"
										onclick={() => {
											open = false;
										}}
										class="flex items-center justify-between text-2xl font-medium"
									>
										<span
											class={{
												'text-primary':
													selectedWeek.from.compare(from) === 0 && selectedWeek.to.compare(to) === 0
											}}
										>
											{#if startOfWeek(today(getLocalTimeZone()), getLocalTimeZone(), 'mon').compare(from) === 0 && endOfWeek(today(getLocalTimeZone()), getLocalTimeZone(), 'mon').compare(to) === 0}
												Current
											{:else}
												{from
													.toDate(getLocalTimeZone())
													.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
												-
												{to
													.toDate(getLocalTimeZone())
													.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
											{/if}
										</span>
										<span class="text-lg text-muted-foreground">
											${week.amount}
										</span>
									</a>
								{/each}
							</div>
						</div>
					{/each}
					{#snippet pending()}
						<div class="flex flex-col gap-4">
							<Skeleton class="h-[20px]" />
							<div class="flex flex-col gap-3">
								{#each { length: 5 }}
									<Skeleton class="h-[32px]" />
								{/each}
							</div>
						</div>
					{/snippet}
				</svelte:boundary>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
