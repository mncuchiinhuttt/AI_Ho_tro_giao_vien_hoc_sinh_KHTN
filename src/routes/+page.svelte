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
	<title>Science Bridge AI</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-white">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-teal-50 via-white to-cyan-50"
		aria-hidden="true"
	></div>

	<div class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-20 md:grid md:grid-cols-[1.1fr,minmax(0,420px)] md:items-center">
		<section class="space-y-8 text-center text-gray-900 md:text-left">
			<span class="inline-flex items-center justify-center rounded-full border-2 border-teal-300 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-teal-700 shadow-sm">
				🧪 AI-assisted teaching
			</span>
			<h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
				Teach science in English with AI support
			</h1>
			<p class="mx-auto text-lg leading-relaxed text-gray-700 md:mx-0">
				Transform Vietnamese science documents into English-ready lesson plans, study packets, and vocabulary lists in minutes. Science Bridge AI keeps bilingual learning on track for teachers and students.
			</p>
			<ul class="grid gap-4 text-left text-sm text-gray-800 md:grid-cols-2">
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-teal-400 shadow-sm"></span>
					<span>Upload a Vietnamese lesson and receive structured English lesson plans automatically.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-cyan-400 shadow-sm"></span>
					<span>Generate student-friendly study materials and homework from the same source.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-teal-500 shadow-sm"></span>
					<span>Build bilingual vocabulary decks with IPA and translations for every lesson.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 h-2 w-2 rounded-full bg-cyan-500 shadow-sm"></span>
					<span>Keep your AI workspace safe with secure accounts and session management.</span>
				</li>
			</ul>
		</section>
		<Card class="w-full border-2 border-gray-200 bg-white shadow-2xl">
			<CardHeader class="space-y-1 text-center">
				<CardTitle class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">Start creating lessons</CardTitle>
				<CardDescription class="text-gray-600">
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
