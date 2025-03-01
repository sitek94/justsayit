import type {
	AiModel,
	FormattingPreset,
	Language,
	PresetConfig,
	SupportedAnthropicModel,
	SupportedOpenAiModel,
} from './types'

export const DEFAULT_AI_MODEL: AiModel = 'claude35Sonnet'
export const DEFAULT_FORMATTING_PRESET: FormattingPreset = 'default'
export const DEFAULT_LANGUAGE: Language = 'en'

export const LANGUAGE_NAMES: Record<Language, string> = {
	en: 'English',
	pl: 'Polish',
	es: 'Spanish',
}

export const OPENAI_MODEL_IDS = {
	gpt4o: 'gpt-4o-2024-11-20' as const,
	gpt4oMini: 'gpt-4o-mini-2024-07-18' as const,
} satisfies Record<SupportedOpenAiModel, string>

export const ANTHROPIC_MODEL_IDS = {
	claude35Sonnet: 'claude-3-5-sonnet-latest' as const,
	claude35Haiku: 'claude-3-5-haiku-latest' as const,
} satisfies Record<SupportedAnthropicModel, string>

export const AI_MODEL_IDS: Record<AiModel, string> = {
	gpt4o: 'gpt-4o-2024-11-20',
	gpt4oMini: 'gpt-4o-mini-2024-07-18',
	claude35Sonnet: 'claude-3-5-sonnet-latest',
	claude35Haiku: 'claude-3-5-haiku-latest',
}

export const DEFAULT_PRESETS: PresetConfig[] = [
	{
		id: 'default',
		name: 'Default',
		shortcut: 'Command+1',
		preset: 'default',
		model: 'claude35Sonnet',
		language: 'en',
	},
	{
		id: 'message-pl',
		name: 'Message (Polish)',
		shortcut: 'Command+2',
		preset: 'message',
		model: 'gpt4o',
		language: 'pl',
	},
	{
		id: 'note',
		name: 'Note',
		shortcut: 'Command+3',
		preset: 'note',
		model: 'claude35Sonnet',
		language: 'en',
	},
	{
		id: 'email',
		name: 'Email',
		shortcut: 'Command+4',
		preset: 'email',
		model: 'claude35Sonnet',
		language: 'en',
	},
]

// SHORTCUTS

export const RECORDING_SHORTCUT = 'Control+Q'

// FILE SYSTEM

export const FILE_SYSTEM = {
	APP_DIR: 'justsayit',
	RECORDINGS_DIR: 'recordings',
}
