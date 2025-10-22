declare module "gtts" {
	export default class gTTS {
		constructor(text: string, lang?: string);
		stream(): NodeJS.ReadableStream;
	}
}
