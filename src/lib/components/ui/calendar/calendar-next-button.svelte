<script lang="ts">
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { type ButtonVariant, buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Calendar as CalendarPrimitive } from 'bits-ui';

	let {
		children,
		class: className,
		ref = $bindable(null),
		variant = 'ghost',
		...restProps
	}: {
		variant?: ButtonVariant;
	} & CalendarPrimitive.NextButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronRightIcon class="size-4" />
{/snippet}

<CalendarPrimitive.NextButton
	bind:ref
	class={cn(
		buttonVariants({ variant }),
		'size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50 rtl:rotate-180',
		className
	)}
	children={children || Fallback}
	{...restProps}
/>
