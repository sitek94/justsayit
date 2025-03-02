import {createAnthropic} from '@ai-sdk/anthropic'
import type {AnthropicMessagesModelId} from '@ai-sdk/anthropic/internal'
import {createOpenAI} from '@ai-sdk/openai'
import type {OpenAIChatModelId} from '@ai-sdk/openai/internal'
import type {LanguageModelV1} from 'ai'
import {requireApiKey} from '$lib/core/settings'

const modelNameToModelId = {
	gpt4o: 'gpt-4o' as const,
	gpt4oMini: 'gpt-4o-mini' as const,
	claude35Sonnet: 'claude-3-5-sonnet-20240620' as const,
	claude35Haiku: 'claude-3-5-haiku-20240307' as const,
} satisfies Record<string, OpenAIChatModelId | AnthropicMessagesModelId>

export type ModelName = keyof typeof modelNameToModelId

const getModelId = (modelName: ModelName) => {
	const modelId = modelNameToModelId[modelName]
	if (!modelId) throw new Error(`Unsupported model: ${modelName}`)
	return modelId
}

type ModelProvider = {
	getModel: (model: ModelName) => LanguageModelV1
}

const openaiProvider: ModelProvider = {
	getModel: (model: ModelName) => {
		const openai = createOpenAI({
			apiKey: requireApiKey('openai'),
		})
		return openai(getModelId(model))
	},
}

const anthropicProvider: ModelProvider = {
	getModel: (model: ModelName) => {
		const anthropic = createAnthropic({
			apiKey: requireApiKey('anthropic'),
			headers: {'anthropic-dangerous-direct-browser-access': 'true'},
		})
		return anthropic(getModelId(model))
	},
}

const modelNameToProvider = {
	gpt4o: openaiProvider,
	gpt4oMini: openaiProvider,
	claude35Sonnet: anthropicProvider,
	claude35Haiku: anthropicProvider,
} satisfies Record<string, ModelProvider>

export const getModelProvider = (model: ModelName) => {
	const provider = modelNameToProvider[model]
	if (!provider) throw new Error(`Unsupported model: ${model}`)
	return provider
}
