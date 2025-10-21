import { redirect, type ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ locals }: ServerLoadEvent) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	if (locals.user.verify) {
		throw redirect(302, '/dashboard');
	}

	return {};
};
