<script>
	import UserSelect from './user-select.svelte';
	import WeekMenu from './week-menu.svelte';
</script>

<header class="sticky top-0 z-50 w-full bg-background">
	<div class="container-wrapper 3xl:fixed:px-0 px-6">
		<div class="flex h-[calc(var(--spacing)*14)] items-center">
			<WeekMenu class="flex" />
			<div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
				<UserSelect />
			</div>
		</div>
	</div>
</header>
