import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import {
	generateUserId,
	validateEmail,
	validatePassword,
	validateRole,
	validateUsername
} from '$lib/server/auth/utils';
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

		if (!validateUsername(username)) {
			return fail(400, {
				action: 'login',
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, {
				action: 'login',
				message: 'Invalid password (min 6, max 255 characters)'
			});
		}

		const results = await db.select().from(table.user).where(eq(table.user.username, username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { action: 'login', message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { action: 'login', message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/dashboard');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const email = formData.get('email');
		const role = formData.get('role');

		if (!validateUsername(username)) {
			return fail(400, {
				action: 'register',
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, {
				action: 'register',
				message: 'Invalid password (min 6, max 255 characters)'
			});
		}
		if (!validateEmail(email)) {
			return fail(400, { action: 'register', message: 'Invalid email address' });
		}
		if (!validateRole(role)) {
			return fail(400, { action: 'register', message: 'Invalid role selection' });
		}

		const existingUsername = await db.query.user.findFirst({
			columns: { id: true },
			where: eq(table.user.username, username)
		});
		if (existingUsername) {
			return fail(400, { action: 'register', message: 'Username already in use' });
		}
		const existingEmail = await db.query.user.findFirst({
			columns: { id: true },
			where: eq(table.user.email, email)
		});
		if (existingEmail) {
			return fail(400, { action: 'register', message: 'Email already in use' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({
				id: userId,
				username,
				email,
				passwordHash,
				role
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('register error', error);
			return fail(500, {
				action: 'register',
				message: 'An unexpected error has occurred'
			});
		}
		return redirect(302, '/dashboard');
	}
};
