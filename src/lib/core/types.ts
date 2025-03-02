export type FormattingPreset = 'default' | 'message' | 'note' | 'email'

export type Language = 'en' | 'pl' | 'es'

// TODO: maybe do `apiKeys.openai` etc
export type Settings = {
	apiKeys: {
		groq: string
		openai: string
		anthropic: string
	}
}

/**
 * Audio recording result
 */
export type RecordingResult = {
	audio: Blob
	transcript: string
	raw: string
}
