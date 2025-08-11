<script>
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	let {input = ""} = $props();
</script>

<div class="flex flex-col gap-3">
	<Label>Name</Label>
	<Input name="name" value={input}/>
</div>
