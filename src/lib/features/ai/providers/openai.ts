import {createOpenAI} from '@ai-sdk/openai'
import type {AiProvider} from './types'
import {AI_MODEL_IDS} from '$lib/core/constants'
import type {AiModel, SupportedOpenAiModel} from '$lib/core/types'

export const openaiProvider: AiProvider = {
	getModel(model: AiModel, apiKey: string) {
		const openai = createOpenAI({apiKey})

		if (this.supportsModel(model)) {
			return openai(AI_MODEL_IDS[model])
		}

		throw new Error(`Unsupported OpenAI model: ${model}`)
	},

	supportsModel: (model: AiModel): model is SupportedOpenAiModel => {
		const supportedModels = Object.keys(AI_MODEL_IDS)
		return supportedModels.includes(model)
	},
}
