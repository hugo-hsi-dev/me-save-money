<script lang="ts">
	import ErrorText from '../ui/error-text.svelte';
	import { sanitizeAmountInput } from '$lib/utils/amount';

	let { error, input = '0' }: { error?: string | undefined; input?: string } = $props();

	let value = $state('0');
	let formattedValue = $derived((Number(value) / 100).toFixed(2));

	$effect(() => {
		value = sanitizeAmountInput(input);
	});
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
			value={value}
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
