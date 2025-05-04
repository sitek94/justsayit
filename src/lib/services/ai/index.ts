import {generateText} from 'ai'
import {getModelProvider, type ModelId} from './providers'

export type {ModelId}

export const ai = {
	generateText: async ({
		model,
		...params
	}: Omit<Parameters<typeof generateText>[0], 'model'> & {model: ModelId}) => {
		const provider = getModelProvider(model)
		const response = await generateText({
			...params,
			model: provider.getModel(model),
		})

		return response
	},
}
