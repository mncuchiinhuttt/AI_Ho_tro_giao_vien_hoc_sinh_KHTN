export const AUTH_ROLES = ['admin', 'user'] as const;

export type AuthRole = (typeof AUTH_ROLES)[number];
