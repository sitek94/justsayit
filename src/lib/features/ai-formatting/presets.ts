import {getDefaultPrompt} from './prompts/default'
import {getEmailPrompt} from './prompts/email'
import {getMessagePrompt} from './prompts/message'
import {getNotePrompt} from './prompts/note'
import type {Language} from '$lib/core/types'
import type {ModelName} from '$lib/services/ai'

type Preset = {
	name: string
	language: Language
	model: ModelName
	shortcut?: string
	getPrompt: (text: string) => string
}

/**
 * In the future this could be sourced from db or a file
 * We'd need to store the prompt as a string and provide users with ability
 * to interpolate variables, e.g. "This is a message: {{message}}"
 */
const PRESETS = {
	default: {
		name: 'Default',
		language: 'en',
		model: 'gpt4o',
		getPrompt: text => getDefaultPrompt(text, 'en'),
	},
	message: {
		name: 'Message',
		language: 'en',
		model: 'gpt4o',
		getPrompt: text => getMessagePrompt(text, 'en'),
	},
	messagePolish: {
		name: 'Message (Polish)',
		language: 'pl',
		model: 'gpt4o',
		getPrompt: text => getMessagePrompt(text, 'pl'),
	},
	note: {
		name: 'Note',
		language: 'en',
		model: 'gpt4o',
		getPrompt: text => getNotePrompt(text, 'en'),
	},
	email: {
		name: 'Email',
		language: 'en',
		model: 'gpt4o',
		getPrompt: text => getEmailPrompt(text, 'en'),
	},
} satisfies Record<string, Preset>

export type PresetName = keyof typeof PRESETS

export const getPreset = (name: PresetName) => {
	const preset = PRESETS[name]
	if (!preset) throw new Error(`Preset ${name} not found`)
	return preset
}
