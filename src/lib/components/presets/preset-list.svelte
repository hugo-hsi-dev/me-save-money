<script lang="ts">
	import { getPresets } from '$lib/remote/preset.remote';
	import * as Card from '../ui/card';

	type Preset = {
		amount: string;
		id: string;
		name: string;
	};
</script>

<svelte:boundary>
	<ul class="flex flex-row gap-2">
		{#each await getPresets() as preset (preset.id)}
			{@render card(preset)}
		{/each}
	</ul>
	{#snippet pending()}
		<ul class="flex flex-col gap-2">
			Waiting...
		</ul>
	{/snippet}
</svelte:boundary>

{#snippet card({ amount, name }: Preset)}
	<li>
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-muted-foreground">{name}</Card.Title>
			</Card.Header>
			<Card.Content>
				<span class="text-3xl font-semibold">${amount}</span>
			</Card.Content>
			<!-- <Card.Footer class="flex justify-between">
				<Badge>{createdAt}</Badge>
			</Card.Footer> -->
		</Card.Root>
	</li>
{/snippet}
