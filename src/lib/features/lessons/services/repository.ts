import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { generateLessonId } from '$lib/server/auth/utils';
import { eq, desc } from 'drizzle-orm';
import type { GeneratedLessonData, LessonSummary } from '../types';

export async function getUserLessons(userId: string): Promise<LessonSummary[]> {
	return await db
		.select({
			id: table.lesson.id,
			title: table.lesson.title,
			createdAt: table.lesson.createdAt
		})
		.from(table.lesson)
		.where(eq(table.lesson.creatorId, userId))
		.orderBy(desc(table.lesson.createdAt));
}

export async function getLessonById(lessonId: string) {
	const [found] = await db
		.select()
		.from(table.lesson)
		.where(eq(table.lesson.id, lessonId));
	return found ?? null;
}

export async function saveGeneratedLesson(userId: string, data: GeneratedLessonData): Promise<string> {
	const lessonId = generateLessonId();
	await db.insert(table.lesson).values({
		id: lessonId,
		creatorId: userId,
		title: data.title,
		lessonContent: data.lesson_plan,
		studyContent: data.study_content,
		vocabulary: data.vocabulary,
		createdAt: new Date()
	});
	return lessonId;
}
