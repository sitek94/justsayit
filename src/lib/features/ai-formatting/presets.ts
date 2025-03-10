import type {Language} from '$lib/core/types'
import type {ModelName} from '$lib/services/ai'
import {getDefaultPrompt} from './prompts/default'
import {getEmailPrompt} from './prompts/email'
import {getMessagePrompt} from './prompts/message'
import {getNotePrompt} from './prompts/note'

type Preset = {
	name: string
	model: ModelName
	shortcut?: string
	getPrompt: (text: string) => string
}

export type PresetName = 'default' | 'message' | 'note' | 'email'

export const getPreset = (name: PresetName, language: Language) => {
	/**
	 * In the future this could be sourced from db or a file
	 * We'd need to store the prompt as a string and provide users with ability
	 * to interpolate variables, e.g. "This is a message: {{message}}"
	 */
	const PRESETS = {
		default: {
			name: 'Default',
			model: 'gpt4oMini',
			getPrompt: text => getDefaultPrompt(text, language),
		},
		message: {
			name: 'Message',
			model: 'gpt4oMini',
			getPrompt: text => getMessagePrompt(text, language),
		},
		note: {
			name: 'Note',
			model: 'claude35Sonnet',
			getPrompt: text => getNotePrompt(text, language),
		},
		email: {
			name: 'Email',
			model: 'gpt4oMini',
			getPrompt: text => getEmailPrompt(text, language),
		},
	} satisfies Record<PresetName, Preset>

	const preset = PRESETS[name]
	if (!preset) throw new Error(`Preset ${name} not found`)
	return preset
}
