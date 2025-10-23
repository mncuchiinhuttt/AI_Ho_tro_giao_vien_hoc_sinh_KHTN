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

<main class="relative min-h-screen overflow-hidden bg-white text-gray-900">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-teal-50/30 via-white to-cyan-50/30"
		aria-hidden="true"
	></div>

	<DashboardNavbar user={null} />

	<section class="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
		<Card class="border-2 border-gray-200 bg-white shadow-2xl">
			<CardHeader class="items-center space-y-4 text-center">
				<CardTitle class="mt-5 text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">{title}</CardTitle>
				<CardDescription class="text-base text-gray-600">
					{message}
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-8">
				{#if page.status}
					<div class="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-5 text-sm">
						<p class="font-bold text-gray-900">Technical details</p>
						<p class="text-teal-700 font-semibold">Status code: {page.status}</p>
						{#if page.error?.message}
							<p class="mt-2 text-gray-700">{page.error.message}</p>
						{/if}
					</div>
				{/if}
			</CardContent>
		</Card>
	</section>
</main>
