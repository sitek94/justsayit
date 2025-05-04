import type {Language} from '$lib/core/types'
import {ai} from '$lib/services/ai'
import {getPreset, type PresetName} from './presets'

export const aiFormatting = {
	format: async ({
		text,
		presetName = 'default',
		language = 'en',
	}: {
		text: string
		presetName: PresetName
		language: Language
	}) => {
		if (!text) return ''

		const preset = getPreset(presetName, language)
		const prompt = preset.getPrompt(text)

		const response = await ai.generateText({prompt, model: preset.model})

		console.debug({
			ai: true,
			preset: presetName,
			model: preset.model,
			language,
			text,
			formatted: response.text,
		})

		return response.text
	},
}
