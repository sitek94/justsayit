import {createAnthropic} from '@ai-sdk/anthropic'
import {ANTHROPIC_MODEL_IDS} from '$lib/core/constants'
import type {AiModel, SupportedAnthropicModel} from '$lib/core/types'

export const anthropicProvider = {
	getModel(model: AiModel, apiKey: string) {
		const anthropic = createAnthropic({
			apiKey,
			headers: {'anthropic-dangerous-direct-browser-access': 'true'},
		})

		if (this.supportsModel(model)) {
			return anthropic(ANTHROPIC_MODEL_IDS[model])
		}

		throw new Error(`Unsupported Anthropic model: ${model}`)
	},

	supportsModel: (model: AiModel): model is SupportedAnthropicModel => {
		const supportedModels = Object.keys(ANTHROPIC_MODEL_IDS)
		return supportedModels.includes(model)
	},
}
