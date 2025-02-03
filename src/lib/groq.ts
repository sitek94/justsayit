import Groq, {toFile} from 'groq-sdk'

export const groq = {
	transcribe,
}

async function transcribe(buffer: ArrayBuffer) {
	const client = new Groq({
		// TODO: Get it from user's settings
		apiKey: import.meta.env.VITE_GROQ_API_KEY,
		dangerouslyAllowBrowser: true,
	})

	const transcription = await client.audio.transcriptions.create({
		file: await toFile(buffer, 'audio.wav'),
		prompt: `User is providing his life metrics, like weight, sleep, steps, etc.`,
		model: 'whisper-large-v3',
	})

	return transcription.text
}
