<script lang="ts">
	import { sanitizeAmountInput } from '$lib/utils/amount';

	import ErrorText from '../ui/error-text.svelte';

	let { error, input = '0' }: { error?: string | undefined; input?: string } = $props();

	let value = $state<string | undefined>(undefined);
	let displayValue = $derived(value ?? sanitizeAmountInput(input));
	let formattedValue = $derived((Number(displayValue) / 100).toFixed(2));
	let componentId = $props.id();
	let isFocused = $state(false);

	const handleInput = (event: Event) => {
		const target = event.currentTarget as HTMLInputElement;
		const sanitized = sanitizeAmountInput(target.value);

		if (target.value !== sanitized) {
			target.value = sanitized;
		}

		value = sanitized;
	};
</script>

<div class="flex items-center justify-center pt-12 pb-4">
	<input type="hidden" value={formattedValue} name="amount" />
	<label for="amount-field-{componentId}">
		<span class={['text-7xl font-bold', { 'text-primary': isFocused }]}>${formattedValue}</span>
		<input
			type="text"
			value={displayValue}
			oninput={handleInput}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			id="amount-field-{componentId}"
			inputmode="numeric"
			pattern="[0-9]*"
			autocomplete="off"
			class="size-0 opacity-0"
		/>
		<ErrorText {error} />
	</label>
</div>
