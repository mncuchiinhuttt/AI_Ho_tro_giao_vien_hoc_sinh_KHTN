import gTTS from 'gtts';

const DEFAULT_LANG = 'en';

export async function generateSpeechBuffer(text: string, lang: string = DEFAULT_LANG): Promise<Buffer> {
	return await new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		const stream = new gTTS(text, lang).stream();

		stream.on('data', (chunk: Buffer) => chunks.push(chunk));
		stream.once('end', () => resolve(Buffer.concat(chunks)));
		stream.once('error', (error: unknown) => reject(error));
	});
}
