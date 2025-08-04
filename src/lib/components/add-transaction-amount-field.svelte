<script lang="ts">
	let value = $state(0);
	let formattedValue = $derived((value / 100).toFixed(2));
	let componentId = $props.id();
	let isFocused = $state(false);
</script>

<div class="flex items-center justify-center pt-12 pb-4">
	<label for="amount-field-{componentId}">
		<span class={['text-7xl font-bold', { 'text-primary': isFocused }]}>${formattedValue}</span>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			bind:value
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			id="amount-field-{componentId}"
			inputmode="numeric"
			autofocus
			class="size-0 opacity-0"
		/>
	</label>
</div>
