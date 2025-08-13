<script lang="ts">
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	let { error, input = '' }: { error?: string | undefined; input?: string } = $props();
</script>

<div class="flex flex-col gap-3">
	<Label>Name</Label>
	<Input name="name" value={input} />
	<p class="font-thin text-destructive">{error}</p>
</div>
