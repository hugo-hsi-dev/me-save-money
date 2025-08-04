<script lang="ts">
	import {
		fromDate,
		getLocalTimeZone,
		now,
		parseAbsolute,
		parseAbsoluteToLocal,
		toZoned
	} from '@internationalized/date';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	const id = $props.id();

	let value = $state(now(getLocalTimeZone()));

	let nativeDateValue = $derived(value.toDate());
</script>

<div class="flex gap-4">
	<div class="flex flex-col gap-3">
		<input type="hidden" value={nativeDateValue} name="paidAt" />
		<Label for="{id}-date" class="px-1">Date</Label>
		<Input
			type="datetime-local"
			id="{id}-date"
			bind:value={
				() => {
					return value.toString().slice(0, 16);
				},
				(newValue) => {
					value = fromDate(new Date(newValue), getLocalTimeZone());
				}
			}
		/>
	</div>
</div>
