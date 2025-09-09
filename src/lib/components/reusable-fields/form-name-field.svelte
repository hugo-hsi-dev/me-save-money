<script lang="ts">
	import FormField from '../ui/form-field.svelte';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';

	let { error, input = '' }: { error?: string | undefined; input?: string } = $props();
</script>

<FormField {error}>
	<Label>Name</Label>
	<Input name="name" value={input} />
</FormField>
