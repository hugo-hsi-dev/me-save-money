<script lang="ts">
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	let { input = '', error }:{input?: string, error: string | undefined} = $props();
</script>

<div class="flex flex-col gap-3">
	<Label>Name</Label>
	<Input name="name" value={input} />
	<p class="text-destructive font-thin">{error}</p>
</div>
