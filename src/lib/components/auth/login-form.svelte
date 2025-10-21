<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldContent, FieldError, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import type { AuthFormState } from '$lib/types/auth';

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

			if (response.ok) {
				const redirectLocation = response.headers.get('x-sveltekit-location');
				if (redirectLocation) {
					await goto(redirectLocation);
					return;
				}
                
				await goto('/dashboard');
				return;
			}

			const data = await response.json().catch(() => null);
			errorMessage = data?.message ?? 'Incorrect username or password.';
		} catch (error) {
			console.error('login request failed', error);
			errorMessage = 'Something went wrong. Please try again.';
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
		class="w-full"
		disabled={isSubmitting}
		aria-busy={isSubmitting}
	>
		{isSubmitting ? 'Signing in…' : 'Sign in'}
	</Button>
</form>
