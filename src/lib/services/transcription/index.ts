import type {Language} from '$lib/core/types'
import {getTranscriptionProvider} from './providers'

export const transcription = {
	transcribe: async (audioBuffer: ArrayBuffer, language: Language) => {
		const provider = getTranscriptionProvider()
		const result = await provider.transcribe(audioBuffer, language)
		return result.trim()
	},
}
