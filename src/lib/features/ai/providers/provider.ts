import type {LanguageModelV1} from 'ai'
import type {AiModel} from '$lib/core/types'

export interface AiProvider {
	getModel: (model: AiModel, apiKey: string) => LanguageModelV1
	supportsModel: (model: AiModel) => boolean
}
