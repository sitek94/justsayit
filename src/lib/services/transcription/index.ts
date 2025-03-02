import {getTranscriptionProvider} from './providers'
import type {Language} from '$lib/core/types'

export const transcription = {
	transcribe: async (audioBuffer: ArrayBuffer, language: Language) => {
		const provider = getTranscriptionProvider()

		return await provider.transcribe(audioBuffer, language)
	},
}
