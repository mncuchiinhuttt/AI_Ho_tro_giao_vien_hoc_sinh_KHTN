import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { generateLessonId } from '$lib/server/auth/utils';
import { Buffer } from 'node:buffer';
import { GoogleGenAI, Type } from "@google/genai";
import { mainPrompt } from '$lib/assets/prompt';
import { GOOGLE_API_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	if (!locals.user.verify) {
		throw redirect(302, '/verify');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthenticated' });
		}

		const formData = await request.formData();
		const uploadedEntries = formData.getAll('files');
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

		let contents = [];

		attachments.forEach((file) => {
			contents.push({
				inlineData: {
					mimeType: file.type,
					data: file.buffer.toString('base64')
				}
			});
		});

		contents.push({
			text: mainPrompt
		});

		const ai = new GoogleGenAI({
			apiKey: GOOGLE_API_KEY
		});

		const response = await ai.models.generateContent({
			model: 'gemini-flash-latest',
			contents: contents,
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						study_content: {
							type: Type.STRING
						},
						vocabulary: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									word: { type: Type.STRING },
									ipa: { type: Type.STRING },
									english: { type: Type.STRING },
									vietnamese: { type: Type.STRING }
								},
								required: ['word', 'ipa', 'english', 'vietnamese'],
								propertyOrdering: ['word', 'ipa', 'english', 'vietnamese']
							}
						},
						lesson_plan: {
							type: Type.STRING
						},
						title: {
							type: Type.STRING
						}
					},
					required: ['study_content', 'vocabulary', 'lesson_plan', 'title'],
					propertyOrdering: ['title', 'lesson_plan', 'study_content', 'vocabulary']
				}
			}
		});

		const candidate = response.candidates?.[0];
		const textPart = candidate?.content?.parts?.find(
			(part): part is { text: string } => typeof (part as any).text === 'string'
		)?.text;

		if (!textPart) {
			throw fail(500, { message: 'Gemini returned no text response' });
		}

		const aiResponse = JSON.parse(textPart);

		const lessonId = generateLessonId();

		await db.insert(table.lesson).values({
			id: lessonId,
			creatorId: locals.user.id,
			title: aiResponse.title,
			lessonContent: aiResponse.lesson_plan,
			studyContent: aiResponse.study_content,
			vocabulary: aiResponse.vocabulary,
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
