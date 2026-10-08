import { fail, redirect } from '@sveltejs/kit';
import { loginUser, registerUser } from '$lib/features/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		const result = await loginUser(event, username, password);
		if (!result.success) {
			return fail(400, { action: 'login', message: result.errorMessage ?? 'Incorrect username or password' });
		}

		return redirect(302, '/dashboard');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const email = formData.get('email');
		const role = formData.get('role');

		const result = await registerUser(event, {
			usernameRaw: username,
			passwordRaw: password,
			emailRaw: email,
			roleRaw: role
		});

		if (!result.success) {
			return fail(400, { action: 'register', message: result.errorMessage ?? 'Unable to register' });
		}

		return redirect(302, '/dashboard');
	}
};
