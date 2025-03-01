export type SupportedOpenAiModel = 'gpt4o' | 'gpt4oMini'
export type SupportedAnthropicModel = 'claude35Sonnet' | 'claude35Haiku'
export type AiModel = SupportedOpenAiModel | SupportedAnthropicModel

export type FormattingPreset = 'default' | 'message' | 'note' | 'email'

export type Language = 'en' | 'pl' | 'es'

// TODO: maybe do `apiKeys.openai` etc
export type Settings = {
	groqApiKey: string
	openaiApiKey: string
	anthropicApiKey: string
}

/**
 * Audio recording result
 */
export type RecordingResult = {
	audio: Blob
	transcript: string
	raw: string
}

/**
 * Preset configuration
 */
export type PresetConfig = {
	id: string
	name: string
	shortcut: string
	preset: FormattingPreset
	model: AiModel
	language: Language
}

/**
 * Transcription options
 */
export type TranscriptionOptions = {
	audioBuffer: ArrayBuffer
	apiKey: string
	language: Language
}
