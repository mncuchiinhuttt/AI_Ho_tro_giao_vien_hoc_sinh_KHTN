import {
	boolean,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: userRoleEnum('role').notNull().default('user'),
	verify: boolean('verify').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type LessonVocabularyEntry = {
	word: string;
	ipa: string;
	english: string;
	vietnamese: string;
};

export const lesson = pgTable('lesson', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	lessonContent: text('lesson_content').notNull(),
	studyContent: text('study_content').notNull(),
	vocabulary: jsonb('vocabulary').$type<LessonVocabularyEntry[]>().notNull().default(sql`'[]'::jsonb`)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Lesson = typeof lesson.$inferSelect;
export type NewLesson = typeof lesson.$inferInsert;
