import {createAnthropic} from '@ai-sdk/anthropic'
import type {AnthropicMessagesModelId} from '@ai-sdk/anthropic/internal'
import {createOpenAI} from '@ai-sdk/openai'
import type {OpenAIChatModelId} from '@ai-sdk/openai/internal'
import type {LanguageModelV1} from 'ai'
import {requireApiKey} from '$lib/core/settings'

const supportedOpenAiModels = [
	'gpt-4.1',
	'gpt-4.1-mini',
	'gpt-4.1-nano',
] satisfies OpenAIChatModelId[]
type OpenAiModel = (typeof supportedOpenAiModels)[number]
const isOpenAiModel = (model: string): model is OpenAiModel => {
	return supportedOpenAiModels.includes(model as OpenAiModel)
}

const supportedAnthropicModels = [
	'claude-3-5-haiku-latest',
	'claude-3-5-sonnet-latest',
] satisfies AnthropicMessagesModelId[]
type AnthropicModel = (typeof supportedAnthropicModels)[number]
const isAnthropicModel = (model: string): model is AnthropicModel => {
	return supportedAnthropicModels.includes(model as AnthropicModel)
}

export const supportedModels = [...supportedOpenAiModels, ...supportedAnthropicModels]

export type ModelId = (typeof supportedModels)[number]

type ModelProvider = {
	getModel: (model: ModelId) => LanguageModelV1
}

const openaiProvider: ModelProvider = {
	getModel: (model: ModelId) => {
		if (!isOpenAiModel(model)) {
			throw new Error(`Unsupported OpenAI model: ${model}`)
		}
		const openai = createOpenAI({
			apiKey: requireApiKey('openai'),
		})
		return openai(model)
	},
}

const anthropicProvider: ModelProvider = {
	getModel: (model: ModelId) => {
		if (!isAnthropicModel(model)) {
			throw new Error(`Unsupported Anthropic model: ${model}`)
		}
		const anthropic = createAnthropic({
			apiKey: requireApiKey('anthropic'),
			headers: {'anthropic-dangerous-direct-browser-access': 'true'},
		})
		return anthropic(model)
	},
}

export const getModelProvider = (model: ModelId) => {
	if (isOpenAiModel(model)) {
		return openaiProvider
	}
	if (isAnthropicModel(model)) {
		return anthropicProvider
	}
	throw new Error(`Unsupported model: ${model}`)
}
