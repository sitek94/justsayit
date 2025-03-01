import {getDefaultPrompt} from './default'
import {getEmailPrompt} from './email'
import {getMessagePrompt} from './message'
import {getNotePrompt} from './note'
import type {FormattingPreset, Language} from '$lib/core/types'

export const getPrompt = (text: string, preset: FormattingPreset, language: Language) => {
	switch (preset) {
		case 'default':
			return getDefaultPrompt(text, language)
		case 'message':
			return getMessagePrompt(text, language)
		case 'note':
			return getNotePrompt(text, language)
		case 'email':
			return getEmailPrompt(text, language)
		default:
			return getDefaultPrompt(text, language)
	}
}
