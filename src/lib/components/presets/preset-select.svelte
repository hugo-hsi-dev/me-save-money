<script lang="ts">
	import * as Select from '../ui/select';

	type Preset = {
		amount: string;
		id: string;
		name: string;
	};

	let {presetId = $bindable(), presets}: {presetId?: string, presets: Preset[]} = $props();

	let triggerContent = $derived(
		presets.find((v) => v.id === presetId)?.name ?? "Select one..."
	);
</script>


<Select.Root type="single" name="favoriteFruit" bind:value={presetId}>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
	{#each presets as preset (preset.id)}
		<Select.Item
		value={preset.id}
		label={preset.name}
		>
		{preset.name}
		</Select.Item>
	{/each}
	</Select.Content>
</Select.Root>
