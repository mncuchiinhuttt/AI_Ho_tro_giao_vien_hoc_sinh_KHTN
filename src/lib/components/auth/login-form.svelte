<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldContent, FieldError, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import type { AuthFormState } from '$lib/types/auth';
	import { toast } from 'svelte-sonner';

	export let form: AuthFormState = null;

	let formElement: HTMLFormElement | null = null;
	let isSubmitting = false;
	let errorMessage: string | undefined = form?.action === 'login' ? form?.message ?? undefined : undefined;

	async function handleLogin(event: MouseEvent) {
		event.preventDefault();
		if (!formElement || isSubmitting) return;
		isSubmitting = true;
		errorMessage = undefined;

		const formData = new FormData(formElement);

		try {
			const response = await fetch('?/login', {
				method: 'POST',
				body: formData,
				credentials: 'same-origin'
			});

			if (response.redirected) {
				await goto(response.url);
				return;
			}

			const data = await response.json().catch(() => null);

			if (data?.type === 'redirect' && data.location) {
				window.location.href = data.location;
				return;
			}

			if (data?.type === 'failure') {
				toast.error(data?.data?.message ?? 'Incorrect username or password.');
				return;
			}

			if (response.ok) {
				window.location.href = '/dashboard';
				return;
			}

			toast.error(data?.message ?? 'Incorrect username or password.');
		} catch (error) {
			console.error('login request failed', error);
			toast.error('Something went wrong. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form class="space-y-6" bind:this={formElement}>
	<Field data-invalid={Boolean(errorMessage)}>
		<FieldLabel for="login-username">Username</FieldLabel>
		<FieldContent>
			<Input
				id="login-username"
				name="username"
				autocomplete="username"
				placeholder="Enter your username"
				required
			/>
		</FieldContent>
	</Field>
	<Field data-invalid={Boolean(errorMessage)}>
		<FieldLabel for="login-password">Password</FieldLabel>
		<FieldContent>
			<Input
				id="login-password"
				type="password"
				name="password"
				autocomplete="current-password"
				placeholder="••••••••"
				required
			/>
		</FieldContent>
	</Field>
	{#if errorMessage}
		<FieldError class="mt-2 text-center">{errorMessage}</FieldError>
	{/if}
	<Button
		type="button"
		onclick={handleLogin}
		class="w-full h-11 rounded-xl bg-slate-950 text-white font-medium hover:bg-slate-900 transition-colors shadow-sm"
		disabled={isSubmitting}
		aria-busy={isSubmitting}
	>
		{isSubmitting ? 'Signing in…' : 'Sign In'}
	</Button>
</form>
