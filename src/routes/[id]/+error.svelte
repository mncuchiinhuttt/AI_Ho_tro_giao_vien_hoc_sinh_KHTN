<script lang="ts">
	import { page } from '$app/state';
	import DashboardNavbar from '$lib/components/layout/dashboard-navbar.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import AlertCircle from '@lucide/svelte/icons/alert-circle';

	const title = $derived.by(() => {
		const status = page.status ?? 500;
		if (status === 404) return 'Lesson Not Found';
		if (status === 403) return 'Access Restricted';
		return 'Something Went Wrong';
	});

	const message = $derived.by(() => page.error?.message ?? 'We hit a snag loading this lesson.');
</script>

<svelte:head>
	<title>{title} • Science Bridge AI</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_rgba(15,23,42,0)_55%),_radial-gradient(circle_at_bottom,_rgba(124,58,237,0.25),_rgba(15,23,42,0)_55%)]"
		aria-hidden="true"
	></div>

	<DashboardNavbar user={null} />

	<section class="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
		<Card class="border border-white/10 bg-white/8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.9)] backdrop-blur-xl">
			<CardHeader class="items-center space-y-4 text-center">
				<div class="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white/90">
					<AlertCircle class="size-6" />
				</div>
				<CardTitle class="text-3xl font-semibold tracking-tight text-white">{title}</CardTitle>
				<CardDescription class="text-base text-slate-300">
					{message}
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-8">
				{#if page.status}
					<div class="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-slate-300">
						<p class="font-medium text-white">Technical details</p>
						<p class="text-slate-400">Status code: {page.status}</p>
						{#if page.error?.message}
							<p class="mt-2 text-slate-500">{page.error.message}</p>
						{/if}
					</div>
				{/if}
			</CardContent>
		</Card>
	</section>
</main>
