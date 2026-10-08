import type { RequestHandler } from '@sveltejs/kit';
import { generateSpeechBuffer } from '$lib/features/speech';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { word, lang = 'en' } = await request.json();

		if (typeof word !== "string" || !word.trim()) {
			return new Response(JSON.stringify({ error: "Word is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const normalizedLang = typeof lang === 'string' && lang.trim() ? lang.trim() : 'en';
		const audioBuffer = await generateSpeechBuffer(word.trim(), normalizedLang);
		const audioArray = new Uint8Array(audioBuffer);

		return new Response(audioArray, {
			status: 200,
			headers: {
				"Content-Type": "audio/mpeg",
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		console.error("/api/tts error", error);
		return new Response(JSON.stringify({ error: "Unable to generate audio" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
