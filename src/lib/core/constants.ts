import type {Language} from './types'

export const DEFAULT_LANGUAGE: Language = 'en'

export const LANGUAGE_NAMES: Record<Language, string> = {
	en: 'English',
	pl: 'Polish',
	es: 'Spanish',
}

// export const DEFAULT_PRESETS: PresetConfig[] = [
// 	{
// 		id: 'default',
// 		name: 'Default',
// 		shortcut: 'Command+1',
// 		preset: 'default',
// 		model: 'claude35Sonnet',
// 		language: 'en',
// 	},
// 	{
// 		id: 'message-pl',
// 		name: 'Message (Polish)',
// 		shortcut: 'Command+2',
// 		preset: 'message',
// 		model: 'gpt4o',
// 		language: 'pl',
// 	},
// 	{
// 		id: 'note',
// 		name: 'Note',
// 		shortcut: 'Command+3',
// 		preset: 'note',
// 		model: 'claude35Sonnet',
// 		language: 'en',
// 	},
// 	{
// 		id: 'email',
// 		name: 'Email',
// 		shortcut: 'Command+4',
// 		preset: 'email',
// 		model: 'claude35Sonnet',
// 		language: 'en',
// 	},
// ]

// SHORTCUTS

export const RECORDING_SHORTCUT = 'Control+Q'
