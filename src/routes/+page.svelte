<script>
	import { test } from '$lib/remote/test.remote';
</script>

<button
	onclick={async () => {
		const result = await test();
		console.log(result);
	}}>testing</button
>
