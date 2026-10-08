import { env } from '$env/dynamic/private';
import { getMainPrompt } from '$lib/assets/prompt';
import type { GeneratedLessonData } from '../types';

export interface GenerateLessonInput {
	attachments: Array<{
		name: string;
		type: string;
		size: number;
		buffer: Buffer;
	}>;
	numberOfPeriods: number;
	model?: string;
}

export function cleanAiJson(rawContent: string): string {
	let cleaned = rawContent.trim();
	const footerIndex = cleaned.lastIndexOf('> Cảm ơn bạn đã sử dụng mnRouter');
	if (footerIndex !== -1) {
		cleaned = cleaned.substring(0, footerIndex).trim();
	}
	const markdownBlockMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
	if (markdownBlockMatch) {
		cleaned = markdownBlockMatch[1].trim();
	}
	return cleaned;
}

export async function generateLessonWithAi(input: GenerateLessonInput): Promise<GeneratedLessonData> {
	const userContent: Array<
		| { type: 'text'; text: string }
		| { type: 'image_url'; image_url: { url: string } }
	> = [];

	userContent.push({
		type: 'text',
		text: getMainPrompt(input.numberOfPeriods)
	});

	input.attachments.forEach((file) => {
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
	const aiApiKey = env.AI_API_KEY || '';
	const selectedModel = input.model || env.AI_MODEL || 'gemini-3.8-flash';

	const response = await fetch(`${aiBaseUrl}/chat/completions`, {
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

	if (!response.ok) {
		const errorText = await response.text();
		console.error('AI provider error:', response.status, errorText);
		throw new Error(`AI_PROVIDER_ERROR: ${response.status}`);
	}

	const completion = await response.json();
	const rawContent = completion?.choices?.[0]?.message?.content || '';

	if (!rawContent) {
		throw new Error('AI_EMPTY_RESPONSE');
	}

	const cleanedJson = cleanAiJson(rawContent);

	let aiParsed: GeneratedLessonData;
	try {
		aiParsed = JSON.parse(cleanedJson);
	} catch (parseError) {
		console.error('Failed to parse AI JSON:', parseError, cleanedJson);
		throw new Error('AI_PARSE_ERROR');
	}

	if (!aiParsed.title || !aiParsed.lesson_plan || !aiParsed.study_content) {
		throw new Error('AI_INVALID_SCHEMA');
	}

	return {
		title: aiParsed.title,
		lesson_plan: aiParsed.lesson_plan,
		study_content: aiParsed.study_content,
		vocabulary: aiParsed.vocabulary ?? []
	};
}
