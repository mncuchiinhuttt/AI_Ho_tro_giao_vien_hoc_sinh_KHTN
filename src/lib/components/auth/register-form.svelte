<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Field,
		FieldContent,
		FieldDescription,
		FieldError,
		FieldLabel
	} from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import type { AuthFormState } from '$lib/types/auth';
	import { toast } from 'svelte-sonner';

	let { form = null }: { form: AuthFormState } = $props();

	let formElement: HTMLFormElement | null = null;
	let isSubmitting = $state(false);
	let errorMessage: string | undefined = $state(form?.action === 'register' ? form?.message ?? undefined : undefined);

	async function handleRegister(event: MouseEvent) {
		event.preventDefault();
		if (!formElement || isSubmitting) return;
		isSubmitting = true;
		errorMessage = undefined;

			const formData = new FormData(formElement);
			formData.set('role', 'user');

		try {
			const response = await fetch('?/register', {
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
				toast.error(data?.data?.message ?? 'Unable to create account. Please review your details.');
				return;
			}

			if (response.ok) {
				window.location.href = '/dashboard';
				return;
			}

			toast.error(data?.message ?? 'Unable to create account. Please review your details.');
		} catch (error) {
			console.error('register request failed', error);
			toast.error('Something went wrong. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form class="space-y-6" bind:this={formElement}>
	<Field data-invalid={Boolean(errorMessage)}>
		<FieldLabel for="register-username">Username</FieldLabel>
		<FieldContent>
			<Input
				id="register-username"
				name="username"
				autocomplete="username"
				placeholder="Choose a username"
				required
			/>
			<FieldDescription>3-31 lowercase letters, numbers, underscores, or hyphens.</FieldDescription>
		</FieldContent>
	</Field>
	<Field data-invalid={Boolean(errorMessage)}>
		<FieldLabel for="register-email">Email</FieldLabel>
		<FieldContent>
			<Input
				id="register-email"
				type="email"
				name="email"
				autocomplete="email"
				placeholder="you@example.com"
				required
			/>
		</FieldContent>
	</Field>
	<Field data-invalid={Boolean(errorMessage)}>
		<FieldLabel for="register-password">Password</FieldLabel>
		<FieldContent>
			<Input
				id="register-password"
				type="password"
				name="password"
				autocomplete="new-password"
				placeholder="Create a secure password"
				required
			/>
			<FieldDescription>Minimum 6 characters.</FieldDescription>
		</FieldContent>
	</Field>
	<input type="hidden" name="role" value="user" />
	{#if errorMessage}
		<FieldError class="mt-2 text-center">{errorMessage}</FieldError>
	{/if}
	<Button
		type="button"
		onclick={handleRegister}
		class="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
		disabled={isSubmitting}
		aria-busy={isSubmitting}
	>
		{isSubmitting ? 'Creating account…' : 'Create account'}
	</Button>
</form>
