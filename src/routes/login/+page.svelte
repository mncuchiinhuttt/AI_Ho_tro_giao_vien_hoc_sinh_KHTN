<script lang="ts">
	import type { ActionData } from './$types';
	import LoginForm from '$lib/components/auth/login-form.svelte';
	import RegisterForm from '$lib/components/auth/register-form.svelte';
	import type { AuthFormState } from '$lib/types/auth';

	let { form }: { form: ActionData | null } = $props();
	let mode = $state<'signin' | 'signup'>('signin');
	const formState = form as AuthFormState;
</script>

<svelte:head>
	<title>{mode === 'signin' ? 'Sign In' : 'Sign Up'} • Science Bridge AI</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans selection:bg-teal-500 selection:text-white">
	<!-- Background glow effects -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
		<div class="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/20 via-purple-600/15 to-cyan-500/20 blur-[140px] rounded-full"></div>
		<div class="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 via-teal-500/15 to-purple-600/20 blur-[140px] rounded-full"></div>
	</div>

	<!-- Split Screen Card Shell matching reference image -->
	<div class="w-full max-w-5xl rounded-[32px] md:rounded-[40px] bg-slate-900/60 p-2 sm:p-3 border border-white/10 shadow-2xl backdrop-blur-2xl">
		<div class="grid md:grid-cols-2 rounded-[28px] md:rounded-[36px] overflow-hidden bg-slate-950 min-h-[620px]">
			
			<!-- Left Artwork Side (Abstract modern gradient waves + Quote) -->
			<div class="relative hidden md:flex flex-col justify-between p-10 lg:p-12 overflow-hidden rounded-[26px] md:rounded-[34px] m-2">
				<!-- Vivid abstract background simulation -->
				<div class="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-black"></div>
				<div class="absolute inset-0 -z-10 opacity-90 mix-blend-screen overflow-hidden">
					<div class="absolute -top-20 -left-20 w-[500px] h-[350px] bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 rotate-[-15deg] blur-2xl opacity-75"></div>
					<div class="absolute top-1/3 -right-20 w-[450px] h-[280px] bg-gradient-to-l from-cyan-400 via-blue-500 to-fuchsia-600 rotate-[20deg] blur-3xl opacity-80"></div>
					<div class="absolute -bottom-10 left-10 w-[400px] h-[250px] bg-gradient-to-t from-teal-400 via-indigo-600 to-purple-800 blur-2xl opacity-60"></div>
				</div>
				<!-- Dark glass overlay for contrast -->
				<div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/60"></div>

				<!-- Top: Badge Quote -->
				<div class="flex items-center gap-3">
					<span class="text-xs uppercase tracking-[0.25em] font-semibold text-white/80">
						SCIENCE BRIDGE AI
					</span>
					<div class="h-[1px] w-12 bg-white/30"></div>
				</div>

				<!-- Bottom: Editorial Typography Headline & Subtext -->
				<div class="space-y-4 max-w-sm">
					<h2 class="text-4xl lg:text-5xl font-serif tracking-tight text-white leading-[1.08]">
						Empower Every Science Class.
					</h2>
					<p class="text-sm text-white/70 leading-relaxed font-light">
						Transform Vietnamese curriculum into structured English lesson plans, vocabulary sets, and audio guides effortlessly.
					</p>
				</div>
			</div>

			<!-- Right Form Side (Clean White, Serif Headline, Clean Modern Inputs) -->
			<div class="bg-white text-slate-900 p-8 sm:p-10 lg:p-14 flex flex-col justify-between rounded-[26px] md:rounded-[34px] m-2">
				<!-- Brand Header -->
				<div class="flex items-center justify-between mb-6">
					<a href="/" class="flex items-center gap-2 group">
						<div class="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
							🔬
						</div>
						<span class="font-bold text-base tracking-tight text-slate-900">
							Science Bridge
						</span>
					</a>
					<a href="/" class="text-xs text-slate-400 hover:text-slate-600 font-medium">
						← Trang chủ
					</a>
				</div>

				<!-- Main Form Container -->
				<div class="my-auto max-w-sm w-full mx-auto space-y-6">
					<div class="text-center space-y-1.5">
						<h1 class="text-3xl sm:text-4xl font-serif text-slate-950 tracking-tight font-medium">
							{mode === 'signin' ? 'Welcome Back' : 'Create Account'}
						</h1>
						<p class="text-xs text-slate-500 font-normal">
							{mode === 'signin'
								? 'Enter your username and password to access your account'
								: 'Sign up to start preparing bilingual science materials'}
						</p>
					</div>

					{#if mode === 'signin'}
						<LoginForm form={formState} />
					{:else}
						<RegisterForm form={formState} />
					{/if}
				</div>

				<!-- Footer Switch Mode -->
				<div class="mt-8 text-center text-xs text-slate-500">
					{#if mode === 'signin'}
						Don't have an account?
						<button
							type="button"
							onclick={() => (mode = 'signup')}
							class="text-slate-950 font-bold hover:underline ml-1 cursor-pointer"
						>
							Sign Up
						</button>
					{:else}
						Already have an account?
						<button
							type="button"
							onclick={() => (mode = 'signin')}
							class="text-slate-950 font-bold hover:underline ml-1 cursor-pointer"
						>
							Sign In
						</button>
					{/if}
				</div>

			</div>
		</div>
	</div>
</main>
