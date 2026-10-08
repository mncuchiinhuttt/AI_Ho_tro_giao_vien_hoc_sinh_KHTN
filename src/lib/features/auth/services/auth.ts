import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';
import {
	generateUserId,
	validateEmail,
	validatePassword,
	validateRole,
	validateUsername
} from '$lib/server/auth/utils';
import type { RequestEvent } from '@sveltejs/kit';

export interface LoginResult {
	success: boolean;
	errorMessage?: string;
}

export interface RegisterResult {
	success: boolean;
	errorMessage?: string;
}

export async function loginUser(
	event: RequestEvent,
	usernameRaw: unknown,
	passwordRaw: unknown
): Promise<LoginResult> {
	if (!validateUsername(usernameRaw)) {
		return { success: false, errorMessage: 'Invalid username' };
	}
	if (!validatePassword(passwordRaw)) {
		return { success: false, errorMessage: 'Invalid password' };
	}

	const results = await db.select().from(table.user).where(eq(table.user.username, usernameRaw));
	const existingUser = results.at(0);
	if (!existingUser) {
		return { success: false, errorMessage: 'Incorrect username or password' };
	}

	const validPassword = await verify(existingUser.passwordHash, passwordRaw as string, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	if (!validPassword) {
		return { success: false, errorMessage: 'Incorrect username or password' };
	}

	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, existingUser.id);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return { success: true };
}

export async function registerUser(
	event: RequestEvent,
	data: {
		usernameRaw: unknown;
		passwordRaw: unknown;
		emailRaw: unknown;
		roleRaw: unknown;
	}
): Promise<RegisterResult> {
	const { usernameRaw, passwordRaw, emailRaw, roleRaw } = data;

	if (!validateUsername(usernameRaw)) {
		return {
			success: false,
			errorMessage: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
		};
	}
	if (!validatePassword(passwordRaw)) {
		return {
			success: false,
			errorMessage: 'Invalid password (min 6, max 255 characters)'
		};
	}
	if (!validateEmail(emailRaw)) {
		return { success: false, errorMessage: 'Invalid email address' };
	}
	if (!validateRole(roleRaw)) {
		return { success: false, errorMessage: 'Invalid role selection' };
	}

	const existingUsername = await db.query.user.findFirst({
		columns: { id: true },
		where: eq(table.user.username, usernameRaw as string)
	});
	if (existingUsername) {
		return { success: false, errorMessage: 'Username already in use' };
	}

	const existingEmail = await db.query.user.findFirst({
		columns: { id: true },
		where: eq(table.user.email, emailRaw as string)
	});
	if (existingEmail) {
		return { success: false, errorMessage: 'Email already in use' };
	}

	const userId = generateUserId();
	const passwordHash = await hash(passwordRaw as string, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	try {
		await db.insert(table.user).values({
			id: userId,
			username: usernameRaw as string,
			email: emailRaw as string,
			passwordHash,
			role: roleRaw as 'admin' | 'user'
		});

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return { success: true };
	} catch (error) {
		console.error('Registration database error:', error);
		return { success: false, errorMessage: 'An unexpected error has occurred' };
	}
}
