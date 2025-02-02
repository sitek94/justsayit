import Groq, {toFile} from 'groq-sdk'
import {env, modelNames} from './constants'

export const groq = {
	transcribe,
}

const client = new Groq({apiKey: env.GROQ_API_KEY, dangerouslyAllowBrowser: true})

async function transcribe(buffer: ArrayBuffer) {
	const transcription = await client.audio.transcriptions.create({
		file: await toFile(buffer, 'audio.wav'),
		prompt: `User is providing his life metrics, like weight, sleep, steps, etc.`,
		model: modelNames.whisperLargeV3,
	})

	return transcription.text
}
