import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Buffer } from 'node:buffer';
import {
	getUserLessons,
	saveGeneratedLesson,
	generateLessonWithAi
} from '$lib/features/lessons';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	if (!locals.user.verify) {
		throw redirect(302, '/verify');
	}

	// Fetch user's lessons
	const userLessons = await getUserLessons(locals.user.id);

	return {
		user: locals.user,
		lessons: userLessons
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthenticated' });
		}

		const formData = await request.formData();
		const uploadedEntries = formData.getAll('files');
		const selectedModel =
			formData.get('model')?.toString();
		const numberOfPeriods = parseInt(
			formData.get('numberOfPeriods')?.toString() ||
			formData.get('periods')?.toString() ||
			'1'
		);
		
		const attachments = await Promise.all(
			uploadedEntries
				.filter((entry): entry is File => entry instanceof File)
				.map(async (file) => ({
					name: file.name,
					type: file.type,
					size: file.size,
					buffer: Buffer.from(await file.arrayBuffer())
				}))
		);

		if (attachments.length === 0) {
			return fail(400, { message: 'Please attach at least one file.' });
		}

		let aiData;
		try {
			aiData = await generateLessonWithAi({
				attachments,
				numberOfPeriods,
				model: selectedModel
			});
		} catch (error) {
			console.error('Lesson creation AI error:', error);
			return fail(503, { message: 'AI service is currently unavailable. Please try again later.' });
		}

		const lessonId = await saveGeneratedLesson(locals.user.id, aiData);
		return {
			success: true,
			lessonId
		};
	},

	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		throw redirect(302, '/');
	}
};
