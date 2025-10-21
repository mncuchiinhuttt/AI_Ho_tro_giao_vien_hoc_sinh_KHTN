<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Verify Your Account</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.4),_rgba(15,23,42,0)_55%),_radial-gradient(circle_at_bottom,_rgba(20,184,166,0.3),_rgba(15,23,42,0)_55%)]"
		aria-hidden="true"
	></div>

	<section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-20">
		<Card class="w-full max-w-xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur">
			<CardHeader class="space-y-3 text-center">
				<CardTitle class="text-3xl font-semibold text-foreground">Verification Pending</CardTitle>
				<CardDescription class="text-base leading-relaxed text-muted-foreground">
					We’re excited to have you here. For security reasons an administrator needs to confirm your
					identity before we can activate the account.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<Alert class="border-amber-400/30 bg-amber-500/10 text-amber-600">
					<AlertTitle>Manual review in progress</AlertTitle>
					<AlertDescription class="text-sm leading-relaxed">
						Reach out to your system administrator and share the details they request so we can finish
						activating your access.
					</AlertDescription>
				</Alert>

				<div class="space-y-4 text-sm leading-relaxed text-black-300">
					<p class="text-black-200">
						To speed things up, prepare the following information when you contact the admin team:
					</p>
					<ul class="grid gap-3 text-left sm:grid-cols-2">
						<li class="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
							<span class="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span>
							<div class="space-y-1">
								<p class="font-medium text-black-100">Full name</p>
								<p class="text-xs text-black-400">Matches the name used during registration.</p>
							</div>
						</li>
						<li class="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
							<span class="mt-1 h-2 w-2 rounded-full bg-sky-400"></span>
							<div class="space-y-1">
								<p class="font-medium text-black-100">School or organization</p>
								<p class="text-xs text-black-400">Helps us match you with the correct roster.</p>
							</div>
						</li>
						<li class="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:col-span-2">
							<span class="mt-1 h-2 w-2 rounded-full bg-violet-400"></span>
							<div class="space-y-1">
								<p class="font-medium text-black-100">Contact verification</p>
								<p class="text-xs text-black-400">
									Provide the best email or phone number so the team can reach you if they have any
									follow-up questions.
								</p>
							</div>
						</li>
					</ul>
				</div>

				<div class="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-center">
					<Button href="mailto:vominhlong@mncuchiinhuttt.dev" class="w-full sm:w-auto">
						Email the admin team
					</Button>
				</div>
				<p class="text-center text-xs text-slate-500">
					Need an update? Administrators typically respond within one business day.
				</p>
			</CardContent>
		</Card>
	</section>
</main>
