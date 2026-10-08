import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { generateLessonId } from '$lib/server/auth/utils';
import { Buffer } from 'node:buffer';
import { getMainPrompt } from '$lib/assets/prompt';
import { env } from '$env/dynamic/private';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	if (!locals.user.verify) {
		throw redirect(302, '/verify');
	}

	// Fetch user's lessons
	const userLessons = await db
		.select({
			id: table.lesson.id,
			title: table.lesson.title,
			createdAt: table.lesson.createdAt
		})
		.from(table.lesson)
		.where(eq(table.lesson.creatorId, locals.user.id))
		.orderBy(desc(table.lesson.createdAt));

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
			formData.get('model')?.toString() ||
			env.AI_MODEL ||
			'gemini-3.8-flash';
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

		const userContent: Array<
			| { type: 'text'; text: string }
			| { type: 'image_url'; image_url: { url: string } }
		> = [];

		userContent.push({
			type: 'text',
			text: getMainPrompt(numberOfPeriods)
		});

		attachments.forEach((file) => {
			const base64Data = file.buffer.toString('base64');
			const mimeType = file.type || 'application/octet-stream';
			userContent.push({
				type: 'image_url',
				image_url: {
					url: `data:${mimeType};base64,${base64Data}`
				}
			});
		});

		const aiBaseUrl = (env.AI_BASE_URL || 'https://mnrouter.mncuchiinhuttt.dev/v1').replace(/\/+$/, '');
		const aiApiKey = env.AI_API_KEY || 'mr_jjvbKlOeu8IE4o5L87FqK4nS0pis36eyRdxPtJN9w0u';

		let rawContent = '';
		try {
			const aiResponse = await fetch(`${aiBaseUrl}/chat/completions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${aiApiKey}`
				},
				body: JSON.stringify({
					model: selectedModel,
					messages: [
						{
							role: 'user',
							content: userContent
						}
					],
					response_format: { type: 'json_object' }
				})
			});

			if (!aiResponse.ok) {
				const errorText = await aiResponse.text();
				console.error('AI provider error:', aiResponse.status, errorText);
				return fail(503, { message: 'AI provider error. Please try again later.' });
			}

			const completion = await aiResponse.json();
			rawContent = completion?.choices?.[0]?.message?.content || '';
		} catch (e) {
			console.error('AI fetch error:', e);
			return fail(503, { message: 'AI service is currently unavailable. Please try again later.' });
		}

		if (!rawContent) {
			return fail(500, { message: 'AI returned an empty response.' });
		}

		let cleanJson = rawContent.trim();
		const footerIndex = cleanJson.lastIndexOf('> Cảm ơn bạn đã sử dụng mnRouter');
		if (footerIndex !== -1) {
			cleanJson = cleanJson.substring(0, footerIndex).trim();
		}
		const markdownBlockMatch = cleanJson.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
		if (markdownBlockMatch) {
			cleanJson = markdownBlockMatch[1].trim();
		}

		let aiParsed: {
			title?: string;
			lesson_plan?: string;
			study_content?: string;
			vocabulary?: Array<{
				word: string;
				ipa: string;
				english: string;
				vietnamese: string;
			}>;
		};

		try {
			aiParsed = JSON.parse(cleanJson);
		} catch (parseError) {
			console.error('Failed to parse AI JSON:', parseError, cleanJson);
			return fail(500, { message: 'Failed to parse AI response as JSON.' });
		}

		if (!aiParsed.title || !aiParsed.lesson_plan || !aiParsed.study_content) {
			return fail(500, { message: 'AI response missing required fields.' });
		}

		const lessonId = generateLessonId();

		await db.insert(table.lesson).values({
			id: lessonId,
			creatorId: locals.user.id,
			title: aiParsed.title,
			lessonContent: aiParsed.lesson_plan,
			studyContent: aiParsed.study_content,
			vocabulary: aiParsed.vocabulary ?? [],
			createdAt: new Date()
		});
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
