import {generateText} from 'ai'
import {providerRegistry} from './providers'
import type {AiModel} from '$lib/core/types'

type AiProviderOptions = {model: AiModel; apiKeys: Record<string, string>}
type GenerateTextParams = Omit<Parameters<typeof generateText>[0], 'model'>

export const ai = {
	generateText: async ({model, apiKeys, ...params}: GenerateTextParams & AiProviderOptions) => {
		const {provider, providerName} = providerRegistry.getProviderForModel(model)

		const apiKey = apiKeys[providerName]
		if (!apiKey) {
			throw new Error(`API key not provided for ${providerName}`)
		}

		const response = await generateText({
			...params,
			model: provider.getModel(model, apiKey),
		})

		return response.text
	},
}
