import {getPreset, type PresetName} from './presets'
import {ai} from '$lib/services/ai'

export const aiFormatting = {
	format: async ({text, presetName = 'default'}: {text: string; presetName: PresetName}) => {
		if (!text) return ''

		const preset = getPreset(presetName)
		const prompt = preset.getPrompt(text)

		const response = await ai.generateText({prompt, model: preset.model})
		return response.text
	},
}
