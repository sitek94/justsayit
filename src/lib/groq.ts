import Groq, {toFile} from 'groq-sdk'

export const groq = {
	transcribe,
}

async function transcribe(buffer: ArrayBuffer, apiKey: string, language: 'en' | 'pl' | 'es') {
	const client = new Groq({
		apiKey,
		dangerouslyAllowBrowser: true,
	})

	const transcription = await client.audio.transcriptions.create({
		file: await toFile(buffer, 'audio.wav'),
		prompt: `User is providing his life metrics, like weight, sleep, steps, etc.`,
		model: 'whisper-large-v3',
		language,
	})

	return transcription.text
}
