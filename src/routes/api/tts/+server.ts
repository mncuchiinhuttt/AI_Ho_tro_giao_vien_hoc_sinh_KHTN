import gTTS from "gtts";
import type { RequestHandler } from "@sveltejs/kit";

const DEFAULT_LANG = "en";

const streamToBuffer = async (text: string, lang: string) => {
	return await new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		const stream = new gTTS(text, lang).stream();

		stream.on("data", (chunk: Buffer) => chunks.push(chunk));
		stream.once("end", () => resolve(Buffer.concat(chunks)));
		stream.once("error", (error: unknown) => reject(error));
	});
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { word, lang = DEFAULT_LANG } = await request.json();

		if (typeof word !== "string" || !word.trim()) {
			return new Response(JSON.stringify({ error: "Word is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const normalizedLang = typeof lang === "string" && lang.trim() ? lang.trim() : DEFAULT_LANG;
		const audioBuffer = await streamToBuffer(word.trim(), normalizedLang);
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
