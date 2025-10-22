import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const lessonId = params.id;
	const [lesson] = await db.select().from(table.lesson).where(eq(table.lesson.id, lessonId));

	if (!lesson) {
		throw error(404, 'Lesson not found');
	}

	return {
		lessonId,
		lesson,
		isAuthor: lesson.creatorId === locals.user?.id,
		user: locals.user ?? null
	};
};
