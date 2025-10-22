<script lang="ts">
	import type { ActionData } from './$types';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import LoginForm from '$lib/components/auth/login-form.svelte';
	import RegisterForm from '$lib/components/auth/register-form.svelte';
	import type { AuthFormState } from '$lib/types/auth';

	let { form }: { form: ActionData | null } = $props();
	let activeTab = $state<'login' | 'register'>(
		form?.action === 'register' ? 'register' : 'login'
	);
	const formState = form as AuthFormState;

	$effect(() => {
		if (form?.action && (form.action === 'login' || form.action === 'register')) {
			if (form.action !== activeTab) {
				activeTab = form.action;
			}
		}
	});
</script>

<svelte:head>
	<title>AI Classroom</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-slate-950">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.45),_rgba(15,23,42,0)_55%),_radial-gradient(circle_at_bottom,_rgba(20,184,166,0.35),_rgba(15,23,42,0)_55%)]"
		aria-hidden="true"
	></div>

	<div class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-20 md:grid md:grid-cols-[1.1fr,minmax(0,420px)] md:items-center">
		<section class="space-y-8 text-center text-slate-100 md:text-left">
			<span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
				AI-assisted teaching
			</span>
			<h1 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				Teach science in English with AI support
			</h1>
			<p class="mx-auto text-lg leading-relaxed text-slate-300 md:mx-0">
				Transform Vietnamese science documents into English-ready lesson plans, study packets, and vocabulary lists in minutes. AI Classroom keeps bilingual learning on track for teachers and students.
			</p>
			<ul class="grid gap-4 text-left text-sm text-slate-200 md:grid-cols-2">
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span>
					<span>Upload a Vietnamese lesson and receive structured English lesson plans automatically.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-sky-400"></span>
					<span>Generate student-friendly study materials and homework from the same source.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-violet-400"></span>
					<span>Build bilingual vocabulary decks with IPA and translations for every lesson.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-amber-300"></span>
					<span>Keep your AI workspace safe with secure accounts and session management.</span>
				</li>
			</ul>
		</section>
		<Card class="w-full border border-white/10 bg-background/95 shadow-2xl backdrop-blur">
			<CardHeader class="space-y-1 text-center">
				<CardTitle class="text-2xl font-semibold text-foreground">Start creating lessons</CardTitle>
				<CardDescription class="text-muted-foreground">
					Sign in or register to turn your Vietnamese curriculum into English-ready resources.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs bind:value={activeTab} class="w-full">
					<TabsList class="w-full">
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>
					<TabsContent value="login" class="mt-6">
						<LoginForm form={formState} />
					</TabsContent>
					<TabsContent value="register" class="mt-6">
						<RegisterForm form={formState} />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	</div>
</main>
