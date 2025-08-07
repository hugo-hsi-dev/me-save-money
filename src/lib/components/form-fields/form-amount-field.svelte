<script lang="ts">
	let value = $state(0);
	let formattedValue = $derived((value / 100).toFixed(2));
	let componentId = $props.id();
	let isFocused = $state(false);
</script>

<div class="flex items-center justify-center pt-12 pb-4">
	<input type="hidden" value={formattedValue} name="amount" />
	<label for="amount-field-{componentId}">
		<span class={['text-7xl font-bold', { 'text-primary': isFocused }]}>${formattedValue}</span>

		<input
			type="text"
			bind:value
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			id="amount-field-{componentId}"
			inputmode="numeric"
			class="size-0 opacity-0"
		/>
	</label>
</div>
