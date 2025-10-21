import { encodeBase32LowerCase } from '@oslojs/encoding';
import { AUTH_ROLES, type AuthRole } from '$lib/constants/auth';

export const allowedRoles = AUTH_ROLES;
export type UserRole = AuthRole;

export function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

export function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

export function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: unknown): email is string {
	return typeof email === 'string' && email.length <= 255 && emailPattern.test(email);
}

export function validateRole(role: unknown): role is UserRole {
	return typeof role === 'string' && (AUTH_ROLES as readonly string[]).includes(role);
}
