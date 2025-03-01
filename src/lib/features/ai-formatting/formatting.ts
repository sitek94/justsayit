import {getPrompt} from './presets'
import type {AiModel, FormattingPreset, Language} from '$lib/core/types'
import {ai} from '$lib/features/ai'

type FormattingOptions = {
	text: string
	preset?: FormattingPreset
	model?: AiModel
	language?: Language
	apiKeys: Record<string, string>
}

export const aiFormatting = {
	format: async ({
		text,
		preset = 'default',
		model = 'gpt4o',
		language = 'en',
		apiKeys,
	}: FormattingOptions) => {
		if (!text) return ''

		try {
			const prompt = getPrompt(text, preset, language)

			return await ai.generateText({prompt, model, apiKeys})
		} catch (error) {
			console.error('Error formatting text:', error)
			throw error
		}
	},
}
