<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	type NavUser = {
		id: string;
		username: string;
	};

	let {
		appName = 'AI Classroom',
		user
	}: {
		appName?: string;
		user: NavUser;
	} = $props();
</script>

<nav class="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4 text-slate-100 shadow-sm backdrop-blur">
	<div class="text-lg font-semibold tracking-tight text-white">{appName}</div>
	<div class="flex items-center gap-5">
		<div class="text-right text-sm leading-tight">
			<p class="font-medium text-slate-100">{user.username}</p>
			<p class="text-xs text-slate-400">ID: {user.id}</p>
		</div>
		<form method="post" action="?/logout" use:enhance>
			<Button type="submit" size="sm" variant="destructive">
				Sign out
			</Button>
		</form>
	</div>
</nav>
