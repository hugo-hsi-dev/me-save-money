<script>
	import { signIn } from '$lib/remote/auth.remote';
</script>

<button
	onclick={async () => {
		const result = await signIn({ pin: '081915' });
		console.log(result);
	}}>testing</button
>
