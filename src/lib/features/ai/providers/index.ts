import {z} from 'zod'
import {anthropicProvider} from './anthropic'
import {openaiProvider} from './openai'
import type {AiProvider} from './types'
import type {AiModel} from '$lib/core/types'

const OPENAI_PROVIDER_NAME = 'openai'
const ANTHROPIC_PROVIDER_NAME = 'anthropic'

const providersNames = [OPENAI_PROVIDER_NAME, ANTHROPIC_PROVIDER_NAME] as const
export const ProviderNameSchema = z.enum(providersNames)
export type ProviderName = z.infer<typeof ProviderNameSchema>

export class ProviderRegistry {
	providers: Map<ProviderName, AiProvider>

	constructor() {
		this.providers = new Map([
			[OPENAI_PROVIDER_NAME, openaiProvider],
			[ANTHROPIC_PROVIDER_NAME, anthropicProvider],
		])
	}

	getProviderForModel(model: AiModel): {provider: AiProvider; providerName: ProviderName} {
		for (const [name, provider] of this.providers.entries()) {
			if (provider.supportsModel(model)) {
				return {provider, providerName: name}
			}
		}
		throw new Error(`No provider supports model: ${model}`)
	}

	getAllProviders(): Map<string, AiProvider> {
		return new Map(this.providers)
	}
}

export const providerRegistry = new ProviderRegistry()
