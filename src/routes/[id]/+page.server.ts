import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getLessonById } from '$lib/features/lessons';

export const load: PageServerLoad = async ({ params, locals }) => {
	const lessonId = params.id;
	const lesson = await getLessonById(lessonId);

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
