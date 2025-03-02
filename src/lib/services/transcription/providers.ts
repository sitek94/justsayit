import Groq, {toFile} from 'groq-sdk'
import {requireApiKey} from '$lib/core/settings'
import type {Language} from '$lib/core/types'

type TranscriptionProvider = {
	transcribe: (buffer: ArrayBuffer, language: Language) => Promise<string>
}

const groqProvider: TranscriptionProvider = {
	transcribe: async (buffer: ArrayBuffer, language: Language) => {
		const client = new Groq({
			apiKey: requireApiKey('groq'),
			dangerouslyAllowBrowser: true,
		})

		const transcription = await client.audio.transcriptions.create({
			file: await toFile(buffer, 'audio.wav'),
			model: 'whisper-large-v3',
			language,
		})

		return transcription.text
	},
}

// For now just one provider
export const getTranscriptionProvider = () => groqProvider
